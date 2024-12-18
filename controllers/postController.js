const posts = require('../database/db.js')
const fs = require('fs')
const connection = require('../database/connection')

/* const index = (req, res) => {
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
};*/



function index(req, res) {

    const sql = 'SELECT * FROM posts';



    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
}


function show(req, res) {

    const id = req.params.id
    const sql = 'SELECT * FROM posts WHERE id = ?';

    const tagsSql = `
    SELECT tags.*
    FROM tags
    JOIN post_tag ON tags.id = post_tag.tag_id
    WHERE post_tag.post_id = ?
  `;

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) return res.status(404).json({ error: 'Post non trovato' });


        const posts = results[0]


        connection.query(tagsSql, [id], (err, tagsResults) => {

            if (err) return res.status(500).json({ error: err })

            posts.tags = tagsResults;


            const responseData = {
                data: posts,
            }



            res.status(200).json(responseData);

        })

    })

}



/*const show = (req, res) => {

    const post = posts.find((post) => post.slug.toLowerCase() === req.params.slug)
    if (!post) {
        return res.status(404).json({ error: "Nessun post trovato" })
    }
    return res.status(200).json({ data: post })
}*/


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


function destroy(req, res) {

    const sql = 'DELETE FROM posts WHERE id=?'

    const { id } = req.params;

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Fallimento nel cancellare il post' });

        if (results.affectedRows === 0) return res.status(404).json({ error: `404! Nessun post trovato con id: ${id}` })

        return res.json({ status: 204, affectedRows: results.affectedRows })

    })
}



/*const destroy = (req, res) => {
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
}*/

module.exports = {
    index,
    show,
    store,
    update,
    destroy
}