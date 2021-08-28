const express = require('express')
const { userAuthorization } = require('../middlewares/auth.mw')
const { createNewTicketValidation,replyTicketMessageValidation } = require('../middlewares/formValidation.mw')
const router = express.Router()
const {insertTicket, getTickets, getTicketById, updateClientReply, updateStatusClose} = require('../models/Ticket/Ticket.Model')


// router.all('/', (req,res,next) => {
//     res.json({
//         message : 'Return From Ticket router'
//     })
//     next()
// })

router.post('/', createNewTicketValidation, userAuthorization, async (req,res) => {
    const {subject, sender, message} = req.body
    const userId = req.userId;

      try {
        const ticketObj = {
            clientId: userId,
            subject,
            conversations: [
              {
                sender,
                message,
              },
            ],
          };
         const result = await insertTicket(ticketObj)
    
         if (result._id) {
            return res.json({
              status: "success",
              message: "New ticket has been created!",
            });
          }
      } catch (error) {
          res.json(error)
      }
})

router.get("/", userAuthorization, async (req, res) => {
    try {
      const userId = req.userId;
      const result = await getTickets(userId);
  
      return res.json({
        status: "success",
        result,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

// Get all tickets for a specific user
router.get("/:_id", userAuthorization, async (req, res) => {
    try {
      const { _id } = req.params;
  
      const clientId = req.userId;
      const result = await getTicketById(_id, clientId);
  
      return res.json({
        status: "success",
        result,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

// update reply message form client
router.put("/:_id",
replyTicketMessageValidation,
    userAuthorization,
    async (req, res) => {
      try {
        const { message, sender } = req.body;
        const { _id } = req.params;
        const clientId = req.userId;
  
        const result = await updateClientReply({ _id, message, sender });
  
        if (result._id) {
          return res.json({
            status: "success",
            message: "your message updated",
          });
        }
        res.json({
          status: "error",
          message: "Unable to update your message please try again later",
        });
      } catch (error) {
        res.json({ status: "error", message: error.message });
      }
    }
  );  

  // update ticket status to close
router.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
    try {
      const { _id } = req.params;
      const clientId = req.userId;
  
      const result = await updateStatusClose({ _id, clientId });
  
      if (result._id) {
        return res.json({
          status: "success",
          message: "The ticket has been closed",
        });
      }
      res.json({
        status: "error",
        message: "Unable to update the ticket",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

  router.delete("/:_id", userAuthorization, async (req, res) => {
    try {
      const { _id } = req.params;
      const clientId = req.userId;
  
      const result = await deleteTicket({ _id, clientId });
  
      return res.json({
        status: "success",
        message: "The ticket has been deleted",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

module.exports = router