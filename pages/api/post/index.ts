import Cookies from 'cookies'
import HandleAuth from "../../../services/auth"
import DbConnect, { Post, Category } from "./../../../database/connection"

async function handler(req, res) {
    let { content, title, category, description, publishDate, image, link, _id } = req.body

    let post
    const cookies = new Cookies(req, res)
    let UA = await HandleAuth(cookies.get("auth"))

    await DbConnect()
    if (UA?.username) {
        switch (req.method) {
            case "GET":
                post = await Post.findOne({ link: req.query?.link }).collation({ locale: "en", strength: 1 }).exec()
                post = {
                    _id: post?._id,
                    content: post?.content,
                    publishDate: post?.publishDate,
                    image: post?.image,
                    link: post?.link,
                    description: post?.description,
                    title: post?.title,
                    category: await Category.findOne({ _id: post?.category }).exec()
                }
                break;
            case "POST":
                category = (await Category.findOne({ name: category }).exec())?._id || ""
                post = await (new Post({ content, title, category, description, publishDate, author: UA._id, image, link })).save();
                break;
            case "PUT":
                category = (await Category.findOne({ name: category }).exec())?._id || ""
                post = await Post.findOneAndUpdate({ _id }, { content, title, category, description, publishDate, author: UA._id, image, link: encodeURI(link) }).exec();
                break;
            case "DELETE":
                post = await Post.find({ link: req.query?.link }).remove().exec();
                break;
            default:
                res.status(200).json({})
                break;
        }
        res.status(200).json({ result: post })

    } else {
        res.status(200).json({})
    }
}

export default handler