import { Campaign, Encounter, EncCamp } from "../model.js";

export default {

    getEncounters: async (req, res) => {
        try {
            console.log("hit getEncounters")
            const {userId} = req.session.user
            const encounters = await Encounter.findAll({
                include: {model: EncCamp, include: {model: Campaign}},
                where: {userId}})
                res.status(200).send(encounters)
                
        } catch(theseHands) {
            console.log(theseHands)
            res.sendStatus(500)
        }
    },

    // getEncCamps: async (req, res) => {
    //     try{
    //         console.log("hit getEncCamps")
    //         const encCamp = await EncCamp.findAll({where: {userId}, include: Encounter });
    //         console.log(encCamp)
    //         res.status(200).send(encCamp)
    //     } catch(err){
    //         console.log(err)
    //         res.sendStatus(500)
    //     }
    // },

    //create new encounter
    addEncounter: async (req, res) => {
        try {
            console.log('hit addEncounter')
            const {encounterName, campaignId} = req.body
            const {userId} = req.session.user
            console.log(campaignId)
            await Encounter.create({ encounterName, userId })
            .then(async(info) => {
                console.log(info.dataValues.encounterId)
                if(campaignId){
                    await EncCamp.create({encounterId: info.dataValues.encounterId, campaignId })
                }
            })
            res.status(200).send("New Encounter Added")
        } catch (err) {
            console.log(err)
            res.sendStatus(500).send("Something went wrong")
        }
    },

    editEncounter: async (req, res) => {
        try {
            console.log('hit editEncounter')
            const {encounterName} = req.body
            const {encounterId} = req.params

            await Encounter.update({encounterName}, {where: {encounterId: encounterId}})
            const updatedEncounter = await Encounter.findOne({where: {encounterId}})

            res.status(200).send(updatedEncounter)
        } catch(err){
            console.log(err)
            res.sendStatus(500)
        }
    },

    deleteEncounter: async (req, res) => {
        console.log("hit deleteEncounter")
        try{
            const {encounterId} = req.params
            await Encounter.destroy({where: {encounterId: encounterId}})
            res.sendStatus(200)
        } catch(err){
            console.log(err)
            res.sendStatus(500)
        }
    }

}