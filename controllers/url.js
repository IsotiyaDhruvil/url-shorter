const { nanoid } = require("nanoid");
const Url = require("../models/url");
const user = require("../models/user");

async function handlegeneratenewshorturl(req, res) {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const shortId = nanoid(8);

    await Url.create({
        shortId,
        redirectUrl: url,
        visitHistory: [],
        createdBy: req.user.id,
    });
      const urls = await Url.find({ createdBy: req.user.id });
      req.session.generatedId = shortId;

  return res.redirect("/");
}

async function handleredirect(req, res) {
    const { shortId } = req.params;

    const entry = await Url.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: { timestamp: Date.now() },
            },
        }
    );

    if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectUrl);
}

async function handleanalytics(req, res) {
    const { shortId } = req.params;

    const result = await Url.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({
        totalClicks: result.visitHistory.length,
        visitHistory: result.visitHistory,
    });
}
async function deleteurl(req,res){
    const urlId = req.params.id;

  const query =
    req.user.role === "ADMIN"
      ? { _id: urlId }
      : { _id: urlId, createdBy: req.user.id };

  await Url.deleteOne(query);

  return res.redirect("/");
};

async function deleteallurls(req,res){
    if (req.user.role === "ADMIN") {
        await  Url.deleteMany({});
    } else {
        await  Url.deleteOne({createdBy: req.user.id });
        
    }
    return res.redirect("/");
};


module.exports = {
    handlegeneratenewshorturl,
    handleredirect,
    handleanalytics,
    deleteurl,
    deleteallurls,
};
