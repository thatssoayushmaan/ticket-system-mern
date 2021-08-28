const Ticket = require('./Ticket.Schema')

const insertTicket = (ticketObj) => {
    return new Promise((resolve, reject) => {
        try {
            Ticket(ticketObj)
                .save()
                .then((data) => resolve(data))
                .catch((error) => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}

const getTickets = (clientId) => {
    return new Promise((resolve, reject) => {
      try {
        Ticket.find({ clientId })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

  const getTicketById = (_id, clientId) => {
    return new Promise((resolve, reject) => {
      try {
        Ticket.find({ _id, clientId })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

  const updateClientReply = ({ _id, message, sender }) => {
    return new Promise((resolve, reject) => {
      try {
        Ticket.findOneAndUpdate(
          { _id },
          {
            status: "Pending operator response",
            $push: {
              conversations: { message, sender },
            },
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

  const updateStatusClose = ({ _id, clientId }) => {
    return new Promise((resolve, reject) => {
      try {
        Ticket.findOneAndUpdate(
          { _id, clientId },
          {
            status: "Closed",
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  }; 

  const deleteTicket = ({ _id, clientId }) => {
    return new Promise((resolve, reject) => {
      try {
        Ticket.findOneAndDelete({ _id, clientId })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

module.exports = {
    insertTicket,
    getTickets,
    getTicketById,
    updateClientReply,
    updateStatusClose,
    deleteTicket
}