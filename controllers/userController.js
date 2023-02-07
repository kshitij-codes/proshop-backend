import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

// Auth user & get token: POST /api/users/login: PUBLIC
const authUser = asyncHandler(async(req, res)=> {
    const {email, password} = req.body
    const user = await User.findOne({email})
   
    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// Register New User: GET /api/users/profile: PUBLIC
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    const userExists = await User.findOne({email})

    if (userExists){
        res.status(400)
        throw new Error('USer already exists')
    }

    const user = await User.create({
        name, email, password
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// Get user profile: GET /api/users/profile: PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// Update user profile: PUT /api/users/profile: PRIVATE
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(user){
        user.name = req.body.name || user.name,
        user.email = req.body.email || user.email
        if(req.body.password){
            user.password = req.body.password
        }
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    }else {
        res.status(404)
        throw new Error('User not found')
    }
})

// Get all users: GET /api/users: PRIVATE/ADMIN
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users) 
})

// Delete user: DELETE /api/users/:id: PRIVATE/ADMIN
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if(user){
        await user.remove()
        res.json({message: 'User removed'})
    } else {
        res.status(404)
        throw new Error('user not found')
    }
})

// Get user by ID: GET /api/users/:id: PRIVATE/ADMIN
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    
    if(user){
        res.json(user) 
    } else {
        res.status(404)
        throw new Error('user not found')
    }
})

// Update user: PUT /api/users/:id: PRIVATE/ADMIN
const updateUser = asyncHandler(async (req, res) => {
      
    const user = await User.findById(req.params.id)

    if(user){
        user.name = req.body.name || user.name,
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    }else {
        res.status(404)
        throw new Error('User not found')
    }
})


export {
    authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, updateUser, getUserById
}