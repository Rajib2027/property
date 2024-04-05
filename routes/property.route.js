import express from 'express';
import { addUrl, approval, bookedProperty, changeProjectStatus, changeStatus, check, createProject, createProperty, deleteProperty, featured, filter, find, findType, getAll, getAllPropertyLocations, getAllStatusChanged, getBookedProperty, getListing, getProject, getProjectView, getSize, getUrls, hold, individualProperty, propertyType, sold, updateProperty } from '../controllers/property.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/allProp',getAll)
router.get('/approve',approval)
router.get('/check',check)
router.get('/featured',featured)
router.get('/featured',featured)
router.get('/find',find)
router.post('/filter',filter)
router.get('/findType',findType)
router.get('/propertyType',propertyType)
router.get('/findProperties/:id', individualProperty);
router.post('/create', verifyToken, createProperty);
router.post('/createProject', verifyToken, createProject);




router.put('/update/:id', verifyToken, updateProperty);
router.delete('/delete/:id', verifyToken, deleteProperty);
router.get('/get/:id', getListing);
router.get('/getProject/:id', getProjectView);
router.put('/:propertyId', changeProjectStatus);

router.get('/getLocation', getAllPropertyLocations);
router.post('/bookProperty',bookedProperty)
router.get('/getBookedProperty/:userId',getBookedProperty)
router.get('/getSize',getSize)
router.get('/getUrls',getUrls)
router.get('/getProject',getProject)
router.get('/statusChanged',getAllStatusChanged)
router.post('/addImage',addUrl)
router.put('/changeStatus/:listingId', changeStatus);
router.put('/hold/:listingId', hold);
router.put('/sold/:listingId', sold);


export default router;