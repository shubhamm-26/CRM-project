const Contact = require('../models/contactModel');

exports.createContact = async (req, res) => {
    const { firstName, lastName, email, phone, company, jobTitle } = req.body;
    const createdAt = new Date();
    const contact = new Contact({ firstName, lastName, email, phone, company, jobTitle, createdAt });
    try {
        await contact.save();
        res.status(201).send(contact);
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.getContacts = async (req, res) => {
    try {
        const { q, page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;
        const orderValue = order === "desc" ? -1 : 1;
    
        let searchQuery = {};
        if (q) {
            searchQuery = {
              $or: [
                { firstName: { $regex: q, $options: 'i' } },
                { lastName: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
                { phone: { $regex: q, $options: 'i' } },
                { company: { $regex: q, $options: 'i' } },
                { jobTitle: { $regex: q, $options: 'i' } }
              ]
            };
        }
    
        const contacts = await Contact.find(searchQuery)
          .sort({ [sort]: orderValue })
          .limit(parseInt(limit))
          .skip((parseInt(page) - 1) * parseInt(limit));
    
        const total = await Contact.countDocuments(searchQuery);
    
        res.status(200).send({
          contacts,
          pages: Math.ceil(total / limit),
        });
    } catch (error) {
      res.status(500).send({ error: "Error fetching contacts" });
    }
  };
  
  

exports.updateContact = async (req, res) => {
    const updatedContact = req.body;
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, updatedContact, { new: true });
        if (!contact) {
            return res.status(404).send();
        }
        return res.status(200).send(contact);
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).send();
        }

        res.send(contact);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).send();
        }

        res.send(contact);
    } catch (error) {
        res.status(500).send(error);
    }
}
  