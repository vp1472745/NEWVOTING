import genAuthToken from "../config/auth.js";
import Admin from "../models/adminModel.js";
import Organization from "../models/organizationModel.js";
import bcrypt from "bcrypt";
import sendorgEmail from '../../src/util/adminServices/adminSendemail.js'; // ✅ correct relative path
import crypto from 'crypto';
import nodemailer from 'nodemailer'; // Nodemailer import


export const regesterAdmin = async (req, res,next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new Error("Please fill all the fields");
      error.status = 400;
      next(error);
      return;
    }

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      const error = new Error("Admin already exists");
      error.status = 400;
      next(error);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const loginAdmin = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Please fill all the fields");
      error.status = 400;
      next(error);
      return;
    }
    const admin = await Admin.findOne({ email });

    if (!admin) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      next(error);
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      next(error);
      return;
    }
    const Token = genAuthToken(admin._id, res);
    res.status(200).json({
      success: true,
      admin,
      Token,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logoutAdmin = async (req, res,next) => {
  try {

    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAdminProfile = async (req, res,next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateAdminProfile = async (req, res,next) => {
  try {
    const { name, email } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (name) admin.name = name;
    if (email) admin.email = email;

    await admin.save();

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllOrg = async (req, res,next) => {
  try {
    console.log("getAllOrg");
    const organizations = await Organization.find();
    res.status(200).json({
      success: true,
      organizations,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getOrgById = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      const error = new Error("Organization not found");
      error.status = 404;
      next(error);
      return;
    }
    res.status(200).json({
      success: true,
      organization,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

  

export const createOrg = async (req, res, next) => {
  try {
    const {
      orgName,
      orgEmail,
      orgPassword,
      orgAddress,
      orgPhone,
      orgDescription,
      orgType,
      orgStatus
    } = req.body;

    let { orgLogo, orgWebsite } = req.body;

    // Validation check
    if (!orgName || !orgEmail || !orgPassword || !orgAddress || !orgPhone || !orgDescription || !orgType) {
      const error = new Error("Please fill all required fields");
      error.status = 400;
      return next(error);
    }

    if (!orgWebsite) orgWebsite = "http://www.example.com";

    if (!orgLogo) {
      const words = orgName.split(' ');
      const firstLetter = words[0].charAt(0);
      const secondLetter = words.length > 1 ? words[1].charAt(0) : words[0].charAt(0);
      orgLogo = `https://placehold.co/100x100?text=${firstLetter.toUpperCase()}${secondLetter.toUpperCase()}`;
    }

    // Check if org already exists
    const existingOrg = await Organization.findOne({ orgEmail });
    if (existingOrg) {
      const error = new Error("Organization with this email already exists");
      error.status = 400;
      return next(error);
    }

    // Store plain password temporarily for sending email
    const plainPassword = orgPassword;

    // Hash password for storing in DB
    const hashedPassword = await bcrypt.hash(orgPassword, 10);

    // Create organization
    const organization = await Organization.create({
      orgName,
      orgEmail,
      orgPassword: hashedPassword,
      orgAddress,
      orgPhone,
      orgLogo,
      orgDescription,
      orgWebsite,
      orgType,
      orgStatus: orgStatus || false
    });

    // Send welcome email with plain password
    if (orgStatus) {
      await sendEmail({
        to: orgEmail,
        subject: 'Your Organization Account Credentials',
        html: `
          <div style="font-family: Arial, sans-serif; max-inline-size: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to Our Platform!</h2>
            <p>Here are your organization account credentials:</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Email:</strong> ${orgEmail}</p>
              <p><strong>Password:</strong> ${plainPassword}</p>
            </div>
            <p>Please keep these credentials secure.</p>
          </div>
        `
      });
    }

    // Send response
    res.status(201).json({
      success: true,
      organization,
    });

  } catch (error) {
    next(error);
  }
};
// Generate plain text password
const generatePlainPassword = () => {
  return crypto.randomBytes(8).toString('hex'); // Example: Vineet@1611
};

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  return hashedPassword;
};

export const sendOrgCredentials = async (req, res, next) => {
  try {
    const { orgEmail } = req.body;
    
    // Generate a temporary plain password
    const plainPassword = generatePlainPassword();
    
    // Hash the plain password before storing
    const hashedPassword = await hashPassword(plainPassword);

    // Store hashedPassword in MongoDB (Assuming this is a new organization creation process)
    await Organization.updateOne({ orgEmail }, { $set: { orgPassword: hashedPassword } });

    // Create the nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Organization Portal" <${process.env.EMAIL_USER}>`,
      to: orgEmail,
      subject: 'Your Organization Account Credentials',
      html: `
        <h2>Your Organization Credentials</h2>
        <p>Email: ${orgEmail}</p>
        <p>Password: ${plainPassword}</p>
        <p>Please log in using the above credentials and change your password immediately.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send success response
    res.status(200).json({ success: true, message: 'Credentials sent successfully' });

  } catch (error) {
    console.error('Error sending credentials:', error);
    next(error);
  }
};

export const updateOrg = async (req, res,next) => {
  try {
    const {
      orgName,
      orgEmail,
      orgAddress,
      orgPhone,
      orgLogo,
      orgDescription,
      orgWebsite,
      orgType,
      orgStatus
    } = req.body;
    const organization = await Organization.findById(req.params.id);
    
    if (!organization) {
      const error = new Error("Organization not found");
      error.status = 404;
      next(error);
      return;
    }

    // Update fields if provided
    if (orgName) organization.orgName = orgName;
    if (orgEmail) organization.orgEmail = orgEmail;
    if (orgAddress) organization.orgAddress = orgAddress;
    if (orgPhone) organization.orgPhone = orgPhone;
    if (orgLogo) organization.orgLogo = orgLogo;
    if (orgDescription) organization.orgDescription = orgDescription;
    if (orgWebsite) organization.orgWebsite = orgWebsite;
    if (orgType) organization.orgType = orgType;
    if (orgStatus !== undefined) organization.orgStatus = orgStatus;

    await organization.save();

    res.status(200).json({
      success: true,
      organization,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteOrg = async (req, res,next) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      const error = new Error("Organization not found");
      error.status = 404;
      next(error);
      return;
    }

    await Organization.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateOrgStatus = async (req, res,next) => {
  try {
    const { orgStatus } = req.body;
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }

    organization.orgStatus = orgStatus;
    await organization.save();

    // Send email if status is being activated
    if (orgStatus) {
      try {
        await sendorgEmail(organization.orgEmail, organization.orgPassword);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
    }

    res.status(200).json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error("Update org status error:", error);
    next(error);
  }
};





