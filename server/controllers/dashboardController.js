const Order = require("../models/order")
const Payment = require("../models/payment")
const User = require("../models/user")
const Product = require("../models/products")
const Tables = require("../models/tables")
const ContactFeedback = require("../models/contactFeedback")

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // ===== Revenue =====
    const totalRevenueAgg = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])

    const todayRevenueAgg = await Payment.aggregate([
      { 
        $match: { 
          status: "success",
          createdAt: { $gte: today }
        } 
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])

    const monthRevenueAgg = await Payment.aggregate([
      { 
        $match: { 
          status: "success",
          createdAt: { $gte: startOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])

    // ===== Orders =====
    const totalOrders = await Order.countDocuments()
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } })
    const pendingOrders = await Order.countDocuments({ orderStatus: "Pending" })
    const completedOrders = await Order.countDocuments({ orderStatus: "Completed" })

    // ===== Users =====
    const totalUsers = await User.countDocuments()
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } })

    // ===== Products =====
    const totalProducts = await Product.countDocuments()

    // Top Selling Products
    const topProducts = await Order.aggregate([
      { $unwind: "$cart" },
      {
        $group: {
          _id: "$cart.product",
          totalQty: { $sum: "$cart.quantity" }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          totalQty: 1
        }
      }
    ])

    // ===== Tables =====
    const totalTables = await Tables.countDocuments()
    const reservedTables = await Tables.countDocuments({ status: "Reserved" })

    // ===== Feedback =====
    const totalFeedbacks = await ContactFeedback.countDocuments()
    const pendingFeedbacks = await ContactFeedback.countDocuments({ status: "Pending" })

    res.json({
      success: true,
      revenue: {
        total: totalRevenueAgg[0]?.total || 0,
        today: todayRevenueAgg[0]?.total || 0,
        thisMonth: monthRevenueAgg[0]?.total || 0
      },
      orders: {
        total: totalOrders,
        today: todayOrders,
        pending: pendingOrders,
        completed: completedOrders
      },
      users: {
        total: totalUsers,
        today: newUsersToday
      },
      products: {
        total: totalProducts,
        topSelling: topProducts
      },
      tables: {
        total: totalTables,
        reserved: reservedTables
      },
      feedbacks: {
        total: totalFeedbacks,
        pending: pendingFeedbacks
      }
    })

  } catch (error) {
    console.error("Dashboard Error:", error)
    res.status(500).json({ success: false, message: "Dashboard stats failed" })
  }
}
