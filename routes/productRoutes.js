import  express  from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, 
    deleteProductController, 
    getProductControleer, 
    getSingleProductController,
    productCategoryController,
    productCountController,
    productFiltersController,
    productListController, 
    relatedProductController, 
    searchProductController, 
    updateProductController 
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();


//routes
//CREATE PRODUCTS
router.post("/create-product",requireSignIn,isAdmin,formidable(), createProductController);

//GET ALL PRODUCTS
router.get("/get-product", getProductControleer);

//GET SINGLE-PRODUCT
router.get("/get-product/:slug",  getSingleProductController);

//DELETE PRODUCT
router.delete("/delete-product/:pid", requireSignIn,isAdmin, deleteProductController);

//UPDATE PRODUCT
router.patch('/update-product/:pid', requireSignIn,isAdmin, updateProductController);

//FILTER PRODUCT
router.post('/product-filter', productFiltersController)

//PRODUCT COUNT
router.get('/product-count',productCountController);

//PRODUCT PER PAGE
router.get("/product-list/:page", productListController);

//SEARCH PRODUCT
router.get("/search/:keyword", searchProductController);

//SIMILAR PRODUCT
router.get("/related-product/:pid/:cid", relatedProductController);

//CATEGORY WISE PRODUCT
router.get("/product-category/:slug", productCategoryController);

export default router;