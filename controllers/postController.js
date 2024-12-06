const posts = require('../database/db.js')
const fs = require('fs')
const connection = require('../database/connection')

const index = (req, res) => {
    // let markup = `
    //      res.json
    //         ${posts.map(post => `
    //             <li>
    //                 <h2>${post.title}</h2>
    //                 <p>${post.content}</p>
    //                 <img src="${post.image}" alt="${post.title}" style="width:200px;height:auto;">
    //             </li>
    //         `).join('')}
    //     </ul>
    // `;
    //res.send(markup);
    res.json({
        data: posts,
        counter: posts.length
    })
};



const show = (req, res) => {

    const post = posts.find((post) => post.slug.toLowerCase() === req.params.slug)
    if (!post) {
        return res.status(404).json({ error: "Nessun post trovato" })
    }
    return res.status(200).json({ data: post })
}


const store = (req, res) => {
    const post = {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }
    posts.push(post)

    fs.writeFileSync('./database/db.js',
        `module.exports =${JSON.stringify(posts, null, 4)}`)


    return res.status(201).json({
        status: 201,
        data: posts,
        count: posts.length

    })

}

const update = (req, res) => {

    const post = posts.find(post => post.slug.toLowerCase() === req.params.slug)
    if (!post) {
        return res.status(404).json({
            error: `No post found wit ${req.params.slug} slug`
        })
    }
    post.title = req.body.title,
        post.slug = req.body.slug,
        post.content = req.body.content,
        post.image = req.body.image,
        post.tags = req.body.tags

    fs.writeFileSync('./database/db.js', `module.exports =${JSON.stringify(posts, null, 4)}`)

    res.status(200).json({
        status: 200,
        data: posts
    })

}



const destroy = (req, res) => {
    const post = posts.find(post => post.slug.toLowerCase() === req.params.slug)


    if (!post) {
        res.status(404).json({
            error: `No post found wit ${req.params.slug} slug`
        })

    }

    const newPosts = posts.filter(post => post.slug.toLowerCase() !== req.params.slug)

    fs.writeFileSync('./database/db.js', `module.exports = ${JSON.stringify(newPosts, null, 4)}`)

    res.status(200).json({
        status: 200,
        data: newPosts

    })
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy
}