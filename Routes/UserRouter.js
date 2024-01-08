const express = require('express')
const { authenticateToken } = require('../config/JwtToken');
const { register, login, AllUsers, editUser, UpdateUsers, deleteUser, Accept_User } = require('../controllers/userController');
const { AddBlogs, AllBlogs, editBlog, UpdateBlogs, AddBlogsCategory, AllCategory, deleteBlogCategory, deleteBlog } = require('../controllers/blogController');
const { AddSpecialitiess, AllSpecialitiess, deleteSpecialities } = require('../controllers/specialitiesControllers');
const { Addfeaturess, Allfeaturess, deletefeatures } = require('../controllers/featuresControllers');
const { editDoctor, UpdateDoctor, deleteDoctor, AllDoctors, UpdateDoctorSocail_Media, UpdateDoctorBankDetails, deleteDoctorAwards, deleteDoctorEducation, deleteDoctorExperience, deleteClinicImage } = require('../controllers/doctorController');
const { AllPharmacys, editPharmacy, UpdatePharmacy, deletePharmacy } = require('../controllers/pharmacyController');
const { AllSlots, editSlot, UpdateSlot, deleteSlot, AddSlot } = require('../controllers/slotController');
const { AllAppointments, editAppointment, UpdateAppointment, deleteAppointment, BookAppointment, doctor_appointments, UpdateAppointmentStatus, Patient_appointments } = require('../controllers/appointmentController');
const { AddDependents, AllDependents, editDependent, UpdateDependents, deleteDependent } = require('../controllers/dependendController');
const { AddMedicines, AllMedicines, editMedicine, UpdateMedicines, deleteMedicine } = require('../controllers/medicineController');
const { AddFavourates, deleteFavourate, AllFavourates } = require('../controllers/favourateControllers');
const { sendMessages, AddUserforChat, GetAllChat, AllParticipants } = require('../controllers/chatController');
const { AddProducts, AllProducts, editProduct, UpdateProducts, deleteProduct, AllPharmacyProducts } = require('../controllers/productController');
const { AllProductCategorys, editProductCategory, UpdateProductCategorys, deleteProductCategory, AddProductCategorys, pharmacyProductCategory } = require('../controllers/productCategoryController');
const { AddSupplier, AllSupplier, editSupplier, UpdateSupplier, deleteSupplier, AllPharmacySupplier } = require('../controllers/supplierController');
const { AddPurchases, AllPurchases, editPurchase, UpdatePurchases, deletePurchase, AllPharmacyPurchases } = require('../controllers/purchaseController');
const { addToCart, AllCarts, AllUserCarts, deleteCart } = require('../controllers/cartController');
const { createOrderFromCart, getUserOrders } = require('../controllers/orderController');
const multer = require('multer');
const path = require('path');
// Multer configuration
const storage = multer.diskStorage({
    destination: './public/images', // Specify the destination folder
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (optional)
});


const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/AllUsers', AllUsers)
router.get('/editUser/:id', editUser)
router.get('/AllDoctors', AllDoctors)
router.get('/Allpharmacy', AllPharmacys)
router.put('/UpdateUsers/:id', upload.single('image'),authenticateToken, UpdateUsers)
router.post('/AddBlogs',upload.single('image'),authenticateToken,  AddBlogs)
router.get('/AllBlogs', AllBlogs)
router.get('/editBlog/:id', editBlog)
router.put('/UpdateBlogs/:id', upload.single('image'),authenticateToken, UpdateBlogs)
router.post('/AddBlogsCategory',authenticateToken, AddBlogsCategory)
router.get('/AllCategory', AllCategory)
router.delete('/deleteBlogCategory/:id',authenticateToken, deleteBlogCategory)
router.delete('/deleteBlog/:id',authenticateToken, deleteBlog)
router.delete('/deleteUser/:id',authenticateToken, deleteUser)
router.post('/AddSpecialitiess',upload.single('image'),authenticateToken, AddSpecialitiess)
router.get('/AllSpecialitiess', AllSpecialitiess)
router.delete('/deleteSpecialities/:id',authenticateToken, deleteSpecialities)
router.post('/Addfeaturess',upload.single('image'),authenticateToken, Addfeaturess)
router.get('/Allfeaturess', Allfeaturess)
router.delete('/deletefeatures',authenticateToken, deletefeatures)
router.get('/editDoctor/:id', editDoctor)
router.put('/UpdateDoctor/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ClinicImage', maxCount: 5 }]), authenticateToken, UpdateDoctor);
router.delete('/deleteDoctor/:id',authenticateToken, deleteDoctor)
router.get('/editPharmacy/:id', editPharmacy)
router.put('/UpdatePharmacy/:id', upload.single('image'),authenticateToken, UpdatePharmacy)
router.delete('/deletePharmacy/:id', authenticateToken,deletePharmacy)
router.put('/UpdateDoctorSocail_Media/:id',authenticateToken, UpdateDoctorSocail_Media)
router.put('/UpdateDoctorBankDetails/:id',authenticateToken, UpdateDoctorBankDetails)
router.get('/AllSlots/:id', AllSlots)
router.get('/editSlot/:id', editSlot)
router.put('/UpdateSlot/:id',authenticateToken, UpdateSlot)
router.delete('/deleteSlot/:id',authenticateToken, deleteSlot)
router.post('/AddSlot',authenticateToken, AddSlot)
router.get('/AllAppointments',authenticateToken, AllAppointments)
router.get('/editAppointment/:id', editAppointment)
router.put('/UpdateAppointment/:id',authenticateToken, UpdateAppointment)
router.delete('/deleteAppointment/:id',authenticateToken, deleteAppointment)
router.post('/BookAppointment',authenticateToken, BookAppointment)
router.get('/doctor_appointments/:id',authenticateToken, doctor_appointments)
router.get('/Patient_appointments/:id',authenticateToken, Patient_appointments)
router.put('/UpdateAppointmentStatus/:id',authenticateToken, UpdateAppointmentStatus)
router.get('/AllDependents',authenticateToken, AllDependents)
router.get('/editDependent/:id',authenticateToken, editDependent)
router.put('/UpdateDependents/:id', upload.single('image'),authenticateToken, UpdateDependents)
router.delete('/deleteDependent/:id', authenticateToken,deleteDependent)
router.post('/AddDependents',upload.single('image'),authenticateToken, AddDependents)
router.get('/AllMedicines', AllMedicines)
router.get('/editMedicine/:id', editMedicine)
router.put('/UpdateMedicines/:id', upload.single('image'),authenticateToken, UpdateMedicines)
router.delete('/deleteMedicine/:id',authenticateToken, deleteMedicine)
router.post('/AddMedicines',authenticateToken, AddMedicines)
router.delete('/deleteFavourate/:id',authenticateToken, deleteFavourate)
router.post('/AddFavourates',authenticateToken, AddFavourates)
router.get('/AllFavourates/:id',authenticateToken, AllFavourates)
router.post('/:chatId/send-message',authenticateToken, sendMessages)
router.get('/user/:userId/chats',authenticateToken, GetAllChat)
router.post('/create',authenticateToken, AddUserforChat)
router.get('/AllParticipants',authenticateToken, AllParticipants)
router.get('/AllProducts',authenticateToken, AllProducts)
router.get('/editProduct/:id', editProduct)
router.put('/UpdateProducts/:id', upload.single('image'),authenticateToken, UpdateProducts)
router.delete('/deleteProduct/:id',authenticateToken ,deleteProduct)
router.post('/AddProducts', upload.single('image'),authenticateToken, AddProducts)
router.get('/AllProductCategorys', AllProductCategorys)
router.get('/editProductCategory/:id', editProductCategory)
router.put('/UpdateProductCategorys/:id',authenticateToken, UpdateProductCategorys)
router.delete('/deleteProductCategory/:id',authenticateToken, deleteProductCategory)
router.post('/AddProductCategorys',authenticateToken, AddProductCategorys)
router.get('/AllSupplier',authenticateToken, AllSupplier)
router.get('/editSupplier/:id',authenticateToken, editSupplier)
router.put('/UpdateSupplier/:id', upload.single('image'), authenticateToken,UpdateSupplier)
router.delete('/deleteSupplier/:id',authenticateToken, deleteSupplier)
router.post('/AddSupplier', upload.single('image'),authenticateToken, AddSupplier)
router.get('/AllPurchases',authenticateToken, AllPurchases)
router.get('/editPurchase/:id',authenticateToken, editPurchase)
router.put('/UpdatePurchases/:id', upload.single('image'),authenticateToken, UpdatePurchases)
router.delete('/deletePurchase/:id',authenticateToken, deletePurchase)
router.post('/AddPurchases', upload.single('image'),authenticateToken, AddPurchases)
router.get('/pharmacyProductCategory/:id', pharmacyProductCategory)
router.get('/AllPharmacyProducts/:id', AllPharmacyProducts)
router.get('/AllPharmacySupplier/:id',authenticateToken, AllPharmacySupplier)
router.get('/AllPharmacyPurchases/:id', authenticateToken,AllPharmacyPurchases)
router.post('/addToCart',authenticateToken, addToCart)
router.get('/AllCarts',authenticateToken, AllCarts)
router.get('/AllUserCarts/:id',authenticateToken, AllUserCarts)
router.delete('/deleteCart/:id',authenticateToken, deleteCart)
router.post('/createOrderFromCart',authenticateToken, createOrderFromCart)
router.get('/getUserOrders/:user_id',authenticateToken, getUserOrders)
router.put('/Accept_User/:id',authenticateToken, Accept_User)
router.delete('/deleteDoctorAwards/:doctorId/:awardId',deleteDoctorAwards,authenticateToken)
router.delete('/deleteDoctorEducation/:doctorId/:EducationId',deleteDoctorEducation,authenticateToken)
router.delete('/deleteDoctorExperience/:doctorId/:ExperienceId',deleteDoctorExperience,authenticateToken)
router.delete('/deleteClinicImage/:doctorId/:ClinicImageId',deleteClinicImage,authenticateToken)
// router.get('')


module.exports = router;