const express = require('express');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Server status check endpoints
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server running status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Server running
 */
router.get('/', (req, res) => {
    res.status(200).json({ status: 'Server runing' });
});

module.exports = router;