const express = require('express');
const multer = require('multer');
const fs = require('fs');

const { getOrderHistoryService, processOrderFile } = require('../services/order-history-services');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order endpoints
 * /api/orders:
 *   get:
 *     summary: Retrieve order history
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         description: The ID of the order
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date for the order history (yyyy-mm-dd)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date for the order history (yyyy-mm-dd)
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   orders:
 *                     type: array
 *                     items:
 *                       type: object
 *       404:
 *         description: No orders found
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
    try {
        const { orderId, startDate, endDate, userId } = req.query;

        const userOrders = await getOrderHistoryService(orderId, startDate, endDate, userId);

        if (!userOrders) {
            return res.status(404).json({ message: "Nenhum pedido encontrado." });
        }

        res.json(userOrders.map(item => ({
            user_id: item.user_id,
            name: item.name,
            orders: item.orders
        })));
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Upload and process order file
 *     tags:
 *       - Orders
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File processed successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Internal server error
 */
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Nenhum arquivo enviado." });
        }

        const filePath = file.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        await processOrderFile(fileContent);

        fs.unlink(filePath, (err) =>{
            if(err){
                console.error('Erro ao excluir arquivo.');
            }
        });

        res.json({ message: "Arquivo processado com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});


module.exports = router;
