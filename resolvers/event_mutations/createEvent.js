const User = require("../../models/User");
const Event = require("../../models/Event");

const createEvent = async (parent, args, context, info) => {
  //authentication check
  if (!context.isAuth) throw new Error("User is not authenticated");

  try {
    //gets user in token - to be used later on
    let userFound = await User.findOne({ _id: context.userId });
    if (!userFound) {
      throw new Error("User does not exist");
    }

    let newEvent = new Event({
      ...args.data,
      creator: context.userId,
      registrants: [userId],
      admins: [userId]
    });
    await newEvent.save()

    //add event to the user record
    await User.updateOne(
      { _id: userFound.id },
      {
        $set: {
          createdEvents: [
            ...userFound.createdEvents,
            newEvent,
          ],
          eventAdmin: [...userFound.eventAdmin, newEvent],
        },
      }
    );


    return {
      ...newEvent._doc,
    };
  } catch (e) {
    throw e;
  }
};

module.exports = createEvent;
