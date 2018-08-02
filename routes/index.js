import express from 'express';
import getQuotientFamilial from '../services/quotientFamilial';

const router = express.Router();

router.get('/quotientfamilial', async function(req, res, next) {
  const quotientFamilial = await getQuotientFamilial();

  return res.send(quotientFamilial);
});

export default router;
