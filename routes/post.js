const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController');
const app = express();



router.get('/', postController.index);
router.post('/', postController.store)
router.get('/:id', postController.show)
router.put('/:slug', postController.update)
router.delete('/:id', postController.destroy)

module.exports = router