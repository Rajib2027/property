import express from 'express';
import { allDraft, allInvest, allInvestment, boookInvest, createInvestment, createInvestor, deleteDraft, draft, fetchDraft, getAllInvestment, getAllInvestorEmails, getAllInvestors, getInvestment, individualInvest, search, send, sendInvestmentEmail } from '../controllers/investor.controller.js';


const router = express.Router();

router.post('/create',createInvestor);
router.get('/getAll',getAllInvestors);
router.get('/search',search);
router.post('/draft',draft);
router.post('/createInvestment',createInvestment);
router.get('/allDrafts',allDraft);
router.get('/draft/:projectId',fetchDraft);
router.delete('/deleteDraft/:projectId',deleteDraft)
router.get('/getAllInvestments',getAllInvestment)
router.get('/get/:id', getInvestment);
router.get('/getMails', getAllInvestorEmails);
router.post('/sendMail',sendInvestmentEmail)
router.post('/send/:investmentId',send)
router.post('/save',boookInvest)
router.get('/allInvest',allInvest)
router.get('/invests/:userId',individualInvest);
router.get('/investments',allInvestment)

export default router;