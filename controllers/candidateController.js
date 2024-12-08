const candidateModel = require('../models/candidate');
const User = require('../models/user');

// POST route to add a candidate
const registerCandidate = async function(req, res) {

    try {
        // if (!checkAdminRole(req.user.id)) {
        //     return res.status(403).json({message: 'user does not have admin role'});
        // }

        const candidateData = req.body;
        const newCandidate = new candidateModel(candidateData);

        const response = await newCandidate.save();

        return res.status(201).json({response: response, message: 'Candidate registered succssfully'})
    } catch (error) {
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

const udpateCandidateDetails = async function(req, res) {

    // if (!checkAdminRole(req.user.id)) {
    //     return res.status(403).json({message: 'user does not have admin role'});
    // }
    try {
        const candidateId = req.params.candidateId;
        const updateCandidateData = req.body;

        const response = await candidateModel.findByIdAndUpdate(candidateId, updateCandidateData, {
            new: true,
            runValidators: true
        });

        if (!response) {
            return res.status(404).json({message: 'Candidate Not Found'});
        }

        return res.status(200).json({response: response, message: 'Candidate details updated successfully'});

    } catch (error) {
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

const deleteCandidate = async function(req, res) {

    // if (!checkAdminRole(req.user.id)) {
    //     return res.status(403).json({message: 'user does not have admin role'});
    // }

    try {
        candidateId = req.params.candidateId;
        const response = await candidateModel.findByIdAndDelete(candidateId);

        if (!response) {
            return res.status(404).json({message: 'Candidate not found'});
        }

        return res.status(204).json({message: 'Candidate deleted successfully'});
    } catch(error) {
        return res.status(500).json({message: 'Internal Server Error'});
    }

}

// Start voting
const voteForCandidate = async function(red, res) {

    try {
        const userId = req.user.id;
        const candidateId = red.params.candidateId;

        // admin can't do voting
        if (!checkAdminRole(req.user.id)) {
            return res.status(403).json({message: 'Admin does not have right to vote'});
        }

        const user = await User.findById(userId);
        const candidate = candidateModel.findById(candidateId);

        if (!candidate) {
            return res.status(400).json({message: "Candidate not found"});
        }

        // User can do vote once
        if(!user) {
            return res.status(400).json({message: "User not found"});
        }

        if (user.isVoted) {
            return res.status(400).json({message: 'You have already placed your vote'});
        }

        candidate.votes.push({user: userId});
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true;
        await user.save();

        return res.status(200).json({message: "Vote placed successfully"});

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

// vote counting
const voteCount = async function(req, res) {
    try {
        const candidate = await candidateModel.find().sort({voteCount: 'desc'});
        
        const voteRecord = candidate.map(data => {
            return {
                party: data.party,
                count: data.voteCount
            }
        })

        return res.status(200).json({message: "Vote count getting successfullt", voteRecord});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}

const candidateList = async function(req, res) {
    try {
        const candidates = await candidateModel.find({}, 'name party -_id');
        res.status(200).json({response: candidates, message: "Candidate Listing Successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}

const checkAdminRole = async function(userId) {
    try {
        const userData = await User.findById(userId);
        if (!userData && userData.role !== 'admin') {
            return false;
        }

        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    registerCandidate,
    udpateCandidateDetails,
    deleteCandidate,
    voteForCandidate,
    voteCount,
    candidateList
}
