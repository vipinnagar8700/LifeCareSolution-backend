const express = require('express')
const { authenticateToken } = require('../config/JwtToken');
const { register, login, AllUsers, editUser, UpdateUsers, deleteUser, Accept_User } = require('../controllers/userController');
const { AddBlogs, AllBlogs, editBlog, UpdateBlogs, AddBlogsCategory, AllCategory, deleteBlogCategory, deleteBlog } = require('../controllers/blogController');
const { AddSpecialitiess, AllSpecialitiess, deleteSpecialities } = require('../controllers/specialitiesControllers');
const { Addfeaturess, Allfeaturess, deletefeatures } = require('../controllers/featuresControllers');
const { editDoctor, UpdateDoctor, deleteDoctor, AllDoctors, UpdateDoctorSocail_Media, UpdateDoctorBankDetails } = require('../controllers/doctorController');
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
router.put('/UpdateUsers/:id', upload.single('image'), UpdateUsers)
router.post('/AddBlogs',upload.single('image'),  AddBlogs)
router.get('/AllBlogs', AllBlogs)
router.get('/editBlog/:id', editBlog)
router.put('/UpdateBlogs/:id', upload.single('image'), UpdateBlogs)
router.post('/AddBlogsCategory', AddBlogsCategory)
router.get('/AllCategory', AllCategory)
router.delete('/deleteBlogCategory/:id', deleteBlogCategory)
router.delete('/deleteBlog/:id', deleteBlog)
router.delete('/deleteUser/:id', deleteUser)
router.post('/AddSpecialitiess', AddSpecialitiess)
router.get('/AllSpecialitiess', AllSpecialitiess)
router.delete('/deleteSpecialities/:id', deleteSpecialities)
router.post('/Addfeaturess', Addfeaturess)
router.get('/Allfeaturess', Allfeaturess)
router.delete('/deletefeatures', deletefeatures)
router.get('/editDoctor/:id', editDoctor)
router.put('/UpdateDoctor/:id', upload.single('image'), UpdateDoctor)
router.delete('/deleteDoctor/:id', deleteDoctor)
router.get('/editPharmacy/:id', editPharmacy)
router.put('/UpdatePharmacy/:id', upload.single('image'), UpdatePharmacy)
router.delete('/deletePharmacy/:id', deletePharmacy)
router.put('/UpdateDoctorSocail_Media/:id', UpdateDoctorSocail_Media)
router.put('/UpdateDoctorBankDetails/:id', UpdateDoctorBankDetails)
router.get('/AllSlots', AllSlots)
router.get('/editSlot/:id', editSlot)
router.put('/UpdateSlot/:id', UpdateSlot)
router.delete('/deleteSlot/:id', deleteSlot)
router.post('/AddSlot', AddSlot)
router.get('/AllAppointments', AllAppointments)
router.get('/editAppointment/:id', editAppointment)
router.put('/UpdateAppointment/:id', UpdateAppointment)
router.delete('/deleteAppointment/:id', deleteAppointment)
router.post('/BookAppointment', BookAppointment)
router.get('/doctor_appointments/:id', doctor_appointments)
router.get('/Patient_appointments/:id', Patient_appointments)
router.put('/UpdateAppointmentStatus/:id', UpdateAppointmentStatus)
router.get('/AllDependents', AllDependents)
router.get('/editDependent/:id', editDependent)
router.put('/UpdateDependents/:id', upload.single('image'), UpdateDependents)
router.delete('/deleteDependent/:id', deleteDependent)
router.post('/AddDependents', AddDependents)
router.get('/AllMedicines', AllMedicines)
router.get('/editMedicine/:id', editMedicine)
router.put('/UpdateMedicines/:id', upload.single('image'), UpdateMedicines)
router.delete('/deleteMedicine/:id', deleteMedicine)
router.post('/AddMedicines', AddMedicines)
router.delete('/deleteFavourate/:id', deleteFavourate)
router.post('/AddFavourates', AddFavourates)
router.get('/AllFavourates', AllFavourates)
router.post('/:chatId/send-message', sendMessages)
router.get('/user/:userId/chats', GetAllChat)
router.post('/create', AddUserforChat)
router.get('/AllParticipants', AllParticipants)
router.get('/AllProducts', AllProducts)
router.get('/editProduct/:id', editProduct)
router.put('/UpdateProducts/:id', upload.single('image'), UpdateProducts)
router.delete('/deleteProduct/:id', deleteProduct)
router.post('/AddProducts', upload.single('image'), AddProducts)
router.get('/AllProductCategorys', AllProductCategorys)
router.get('/editProductCategory/:id', editProductCategory)
router.put('/UpdateProductCategorys/:id', UpdateProductCategorys)
router.delete('/deleteProductCategory/:id', deleteProductCategory)
router.post('/AddProductCategorys', AddProductCategorys)
router.get('/AllSupplier', AllSupplier)
router.get('/editSupplier/:id', editSupplier)
router.put('/UpdateSupplier/:id', upload.single('image'), UpdateSupplier)
router.delete('/deleteSupplier/:id', deleteSupplier)
router.post('/AddSupplier', upload.single('image'), AddSupplier)
router.get('/AllPurchases', AllPurchases)
router.get('/editPurchase/:id', editPurchase)
router.put('/UpdatePurchases/:id', upload.single('image'), UpdatePurchases)
router.delete('/deletePurchase/:id', deletePurchase)
router.post('/AddPurchases', upload.single('image'), AddPurchases)
router.get('/pharmacyProductCategory/:id', pharmacyProductCategory)
router.get('/AllPharmacyProducts/:id', AllPharmacyProducts)
router.get('/AllPharmacySupplier/:id', AllPharmacySupplier)
router.get('/AllPharmacyPurchases/:id', AllPharmacyPurchases)
router.post('/addToCart', addToCart)
router.get('/AllCarts', AllCarts)
router.get('/AllUserCarts/:id', AllUserCarts)
router.delete('/deleteCart/:id', deleteCart)
router.post('/createOrderFromCart', createOrderFromCart)
router.get('/getUserOrders/:user_id', getUserOrders)
router.post('/Accept_User/:id', Accept_User)


module.exports = router;