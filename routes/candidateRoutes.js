const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const validateAadhar = require('../middleware/validateAadhar');
const checkAdminRoleMiddleware = require('../middleware/checkAdminRole');
const jwtAuthMiddleware = require('../middleware/jwt');

module.exports = function () {
    router.post('/candidate', checkAdminRoleMiddleware, candidateController.registerCandidate);
    router.put('/candidate/:candidateId', checkAdminRoleMiddleware, candidateController.udpateCandidateDetails);
    router.delete('/candidate/:candidateId', checkAdminRoleMiddleware, candidateController.deleteCandidate);
    router.post('/vote/:candidateId', jwtAuthMiddleware, candidateController.voteForCandidate);
    router.get('/vote/count', candidateController.voteCount);
    router.get('/candidate/list', candidateController.candidateList);
}
