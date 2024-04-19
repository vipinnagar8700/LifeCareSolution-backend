const express = require('express')
const { authenticateToken } = require('../config/JwtToken');
const { register, login, AllUsers, editUser, UpdateUsers, deleteUser, Accept_User, changePassword, register_admin, ResetPassword, New_password, payment, AllUsers_role, loginWithOTP, generateAndSendOTP, login_fb, login_google, SendEmail } = require('../controllers/userController');
const { AddBlogs, AllBlogs, editBlog, UpdateBlogs, AddBlogsCategory, AllCategory, deleteBlogCategory, deleteBlog } = require('../controllers/blogController');
const { AddSpecialitiess, AllSpecialitiess, deleteSpecialities, updateSpecialities, editSpecialities } = require('../controllers/specialitiesControllers');
const { Addfeaturess, Allfeaturess, deletefeatures, editFeatures, updateFeatures } = require('../controllers/featuresControllers');
const { editDoctor, UpdateDoctor, deleteDoctor, AllDoctors, UpdateDoctorSocail_Media, UpdateDoctorBankDetails, deleteDoctorAwards, deleteDoctorEducation, deleteDoctorExperience, deleteClinicImage, FilterDoctors, search_specialities, AllDoctorPermitted, AllDoctorApproved, AllDoctorBlocked, AllDoctorPending, deleteDoctorBlock, UpdateDoctor_register } = require('../controllers/doctorController');
const { AllPharmacys, editPharmacy, UpdatePharmacy, deletePharmacy } = require('../controllers/pharmacyController');
const { AllSlots, editSlot, UpdateSlot, deleteSlot, AddSlot } = require('../controllers/slotController');
const { AllAppointments, editAppointment, UpdateAppointment, deleteAppointment, BookAppointment, doctor_appointments, UpdateAppointmentStatus, Patient_appointments, TodayAppointment, CompleteAppointments, PendingAppointments, CancelAppointments, PastAppointment, UpcomingAppointment, PatientChats, AllChatUsers, AllChatDoctors, AllChatPatient } = require('../controllers/appointmentController');
const { AddDependents, AllDependents, editDependent, UpdateDependents, deleteDependent, AllPatientDependents } = require('../controllers/dependendController');
const { AddMedicines, AllMedicines, editMedicine, UpdateMedicines, deleteMedicine } = require('../controllers/medicineController');
const { AddFavourates, deleteFavourate, AllFavourates } = require('../controllers/favourateControllers');
const { AddProducts, AllProducts, editProduct, UpdateProducts, deleteProduct, AllPharmacyProducts } = require('../controllers/productController');
const { AllProductCategorys, editProductCategory, UpdateProductCategorys, deleteProductCategory, AddProductCategorys, pharmacyProductCategory } = require('../controllers/productCategoryController');
const { AddSupplier, AllSupplier, editSupplier, UpdateSupplier, deleteSupplier, AllPharmacySupplier } = require('../controllers/supplierController');
const { AddPurchases, AllPurchases, editPurchase, UpdatePurchases, deletePurchase, AllPharmacyPurchases } = require('../controllers/purchaseController');
const { addToCart, AllCarts, AllUserCarts, deleteCart } = require('../controllers/cartController');
const { createOrderFromCart, getUserOrders } = require('../controllers/orderController');
const multer = require('multer');
const path = require('path');
const { Reviews, DislikeReview, LikeReview, PatientReview, DoctorReview, AllReviews } = require('../controllers/reviewController');
const { AllVideoSlots, editVideoSlot, UpdateVideoSlot, deleteVideoSlot, AddVideoSlot } = require('../controllers/VideoSlotController');
const { AllInvoices,AllDoctorInvoice, AllPatientInvoice, SingleInvoices } = require('../controllers/invoiceController');
const { edit_admin_profile, Update_admin_profile } = require('../controllers/adminController');
const { AddAvailibility} = require('../controllers/availibilityController');
const { getAllActivities, markActivityAsRead } = require('../controllers/activityController');
const { AllChatUsersMain, AllChatDoctorMain, AllChatPatientMain } = require('../controllers/ChatUserControllers');
const { SendMessages, GetMessages, DeleteAllChats } = require('../controllers/ChatController');
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


// User Auth 
router.post('/register', register);
router.post('/login', login);
router.get('/AllUsers_role',AllUsers_role)
router.post('/loginWithOTP',loginWithOTP)
router.post('/generateAndSendOTP',generateAndSendOTP)
router.post('/login_fb',login_fb)
router.post('/login_google',login_google)

// Patient
router.get('/AllUsers', AllUsers)
router.get('/editUser/:id', editUser)
router.put('/UpdateUsers/:id', upload.single('image'),authenticateToken, UpdateUsers)
router.delete('/deleteUser/:id',authenticateToken, deleteUser)
router.get('/Patient_appointments/:id',authenticateToken, Patient_appointments)
router.get("/PatientReview/:patient_id",PatientReview,authenticateToken);
router.get('/AllDependents', AllDependents)
router.get('/editDependent/:id',authenticateToken, editDependent)
router.get('/AllPatientDependents/:patient_id',authenticateToken,AllPatientDependents)
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
router.get('/PatientChats/:id',PatientChats)
router.get('/AllChatUsers',AllChatUsers)
router.get('/AllChatPatient/:id',AllChatPatient)
router.get('/AllChatDoctors/:id',AllChatDoctors)

// Chat Api users
router.get('/AllChatUsersMain',AllChatUsersMain)
router.post('/SendMessages',upload.single('image'),SendMessages)
router.get('/GetMessages',GetMessages)
router.delete('/DeleteAllChats',DeleteAllChats)
router.get('/AllChatDoctorMain/:id',authenticateToken,AllChatDoctorMain);
router.get('/AllChatPatientMain/:id',authenticateToken,AllChatPatientMain)

// Doctor
router.get('/AllDoctors', AllDoctors)
router.get('/editDoctor/:id', editDoctor)
router.put('/UpdateDoctor/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ClinicImage', maxCount: 5 }]), authenticateToken, UpdateDoctor);
router.put('/UpdateDoctorRegister/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ClinicImage', maxCount: 5 }]), UpdateDoctor);
router.delete('/deleteDoctor/:id',authenticateToken, deleteDoctor)
router.put('/UpdateDoctorSocail_Media/:id',authenticateToken, UpdateDoctorSocail_Media)
router.put('/UpdateDoctorBankDetails',authenticateToken, upload.fields([
    { name: 'Aadhar_image', maxCount: 1 },
    { name: 'Pan_image', maxCount: 1 }
]),UpdateDoctorBankDetails)
router.get('/AllSlots/:id', AllSlots)
router.get('/editSlot/:id', editSlot)
router.put('/UpdateSlot/:id',authenticateToken, UpdateSlot)
router.delete('/deleteSlot/:id',authenticateToken, deleteSlot)
router.post('/AddSlot',authenticateToken, AddSlot)
router.get('/editAppointment/:id', editAppointment)
router.put('/UpdateAppointment/:id',authenticateToken, UpdateAppointment)
router.delete('/deleteAppointment/:id',authenticateToken, deleteAppointment)
router.post('/BookAppointment',authenticateToken, BookAppointment)
router.get('/doctor_appointments/:id',authenticateToken, doctor_appointments)
router.get("/DoctorReview/:doctor_id",DoctorReview,authenticateToken);
router.get('/AllVideoSlots/:id', AllVideoSlots);
router.get('/editVideoSlot/:id', editVideoSlot);
router.put('/UpdateVideoSlot/:id',authenticateToken, UpdateVideoSlot);
router.delete('/deleteVideoSlot/:id',authenticateToken, deleteVideoSlot);
router.post('/AddVideoSlot',authenticateToken, AddVideoSlot);
router.put('/UpdateAppointmentStatus/:id',authenticateToken, UpdateAppointmentStatus)
router.delete('/deleteDoctorAwards/:doctorId/:awardId',deleteDoctorAwards,authenticateToken)
router.delete('/deleteDoctorEducation/:doctorId/:EducationId',deleteDoctorEducation,authenticateToken)
router.delete('/deleteDoctorExperience/:doctorId/:ExperienceId',deleteDoctorExperience,authenticateToken)
router.delete('/deleteClinicImage/:doctorId/:ClinicImageId',deleteClinicImage,authenticateToken)
router.post('/changePassword/:resetToken',authenticateToken,changePassword)
router.get("/doctors/filter", FilterDoctors);
router.post('/Reviews',authenticateToken,Reviews);
router.post('/DislikeReview/:id',DislikeReview,authenticateToken);
router.post('/LikeReview/:id',LikeReview,authenticateToken);
router.put('/UpdateDoctor_register',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ClinicImage', maxCount: 5 }]),authenticateToken,UpdateDoctor_register);
router.get('/SingleInvoices/:id',authenticateToken,SingleInvoices)

// Availibility

router.post('/AddAvailibility',authenticateToken, AddAvailibility)


// Pharmacy
router.get('/Allpharmacy', AllPharmacys)
router.get('/editPharmacy/:id', editPharmacy)
router.put('/UpdatePharmacy/:id', upload.single('image'),authenticateToken, UpdatePharmacy)
router.delete('/deletePharmacy/:id', authenticateToken,deletePharmacy)
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



// Blogs
router.post('/AddBlogs',upload.single('image'),authenticateToken,  AddBlogs)
router.get('/AllBlogs', AllBlogs)
router.get('/editBlog/:id', editBlog)
router.put('/UpdateBlogs/:id', upload.single('image'),authenticateToken, UpdateBlogs)
router.post('/AddBlogsCategory',authenticateToken, AddBlogsCategory)
router.get('/AllCategory', AllCategory)
router.delete('/deleteBlogCategory/:id',authenticateToken, deleteBlogCategory)
router.delete('/deleteBlog/:id',authenticateToken, deleteBlog)





// admin
router.put('/Accept_User/:id',authenticateToken, Accept_User)
router.get('/edit_admin_profile/:id',edit_admin_profile,authenticateToken);
router.put('/Update_admin_profile/:id',upload.single('image'),Update_admin_profile,authenticateToken);
router.post('/register_admin',authenticateToken,register_admin);
router.get('/search_specialities/:specialityId',search_specialities);
router.put('/updateSpecialities/:id',upload.single('image'),updateSpecialities,authenticateToken);
router.get('/editSpecialities/:id',editSpecialities);
router.put('/updateFeatures/:id',upload.single('image'),updateFeatures,authenticateToken);
router.get('/editFeatures/:id',editFeatures);
router.get('/AllAppointments', AllAppointments);
router.post('/AddSpecialitiess',upload.single('image'),authenticateToken, AddSpecialitiess);
router.get('/AllSpecialitiess', AllSpecialitiess);
router.delete('/deleteSpecialities/:id',authenticateToken, deleteSpecialities);
router.post('/Addfeaturess',upload.single('image'),authenticateToken, Addfeaturess);
router.get('/Allfeaturess', Allfeaturess);
router.delete('/deletefeatures/:id',authenticateToken, deletefeatures);
router.get('/AllDoctorPermitted', AllDoctorPermitted);
router.get('/AllDoctorApproved', AllDoctorApproved,authenticateToken);
router.get('/AllDoctorBlocked', AllDoctorBlocked,authenticateToken);
router.get('/AllDoctorPending', AllDoctorPending,authenticateToken);
router.put('/deleteDoctorBlock/:id',authenticateToken,deleteDoctorBlock)
router.get('/AllInvoices',AllInvoices);
router.get('/AllDoctorInvoice/:id',AllDoctorInvoice);
router.get('/AllPatientInvoice/:id',AllPatientInvoice);
router.get("/AllReviews",AllReviews);
router.get("/TodayAppointment",authenticateToken,TodayAppointment);
router.get("/CompleteAppointments",authenticateToken,CompleteAppointments);
router.get("/PendingAppointments",authenticateToken,PendingAppointments);
router.get("/CancelAppointments",authenticateToken,CancelAppointments);
router.get('/PastAppointment',authenticateToken,PastAppointment)
router.get('/UpcomingAppointment',authenticateToken,UpcomingAppointment)
router.get('/getAllActivities',getAllActivities);
router.put('/markActivityAsRead/:id',authenticateToken,markActivityAsRead );

// Email Reset Password
router.post('/ResetPassword',ResetPassword);
router.post('/New_password/:token',New_password);


router.post('/payment',payment);

module.exports = router;