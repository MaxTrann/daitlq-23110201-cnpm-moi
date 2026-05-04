import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log('----------------');
        console.log(data);
        console.log('----------------');
        return res.render('homePage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }
}

// hàm getAbout
let getAboutPage = (req, res) => {
    return res.render('aboutPage.ejs');
}

// hàm getCRUD
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

// hàm findAll CRUD
let getFindAllCrud = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('findAllUser.ejs', {
        dataTable: data
    });
}

// hàm postCRUD
let postCRUD = async (req, res) => {
    try {
        let message = await CRUDService.createNewUser(req.body);
        console.log(message);
        return res.redirect('/get-crud');
    } catch (error) {
        console.error('Create user failed:', error?.message);
        console.error('SQL message:', error?.parent?.sqlMessage || error?.original?.sqlMessage);
        console.error('SQL state:', error?.parent?.sqlState || error?.original?.sqlState);
        console.error('SQL:', error?.sql);

        return res.status(500).send(
            error?.parent?.sqlMessage ||
            error?.original?.sqlMessage ||
            error?.message ||
            'Create user failed'
        );
    }
}

// hàm lấy dữ liệu để edit CRUD
let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render('updateUser.ejs', {
            user: userData
        });
    } else {
        return res.send('User not found!');
    }
}

// hàm put CRUD
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render('findAllUser.ejs', {
        dataTable: allUsers
    });
}

// hàm delete CRUD
let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send('Delete user succeed!');
    } else {
        return res.send('User not found!');
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    getFindAllCrud: getFindAllCrud,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
};
