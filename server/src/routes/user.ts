import express from "express"
import bcrypt from "bcrypt"
import { UserModel } from "../models/user"
import { UserErrors } from "../errors"

const router = express.Router()

router.post("/register", async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserModel({ username, password: hashedPassword })

    await newUser.save()
    res.status(200).json({ message: "User Registered Successfully" })
  } catch (err) {
    res.status(500).json({ type: err })
  }
})

export { router as userRouter } 
