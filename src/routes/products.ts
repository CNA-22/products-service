import { Router } from 'express';

import Product from '../models/Product';
import { queryParamAsString } from '../utils';

const products = Router();

products.get('/', async (req, res) => {
    let sortBy = queryParamAsString(req.query.sort);
    let direction = 'ascending';
    if (sortBy?.startsWith('-')) {
        sortBy = sortBy.slice(1);
        direction = 'descending';
    }
    let page = parseInt(queryParamAsString(req.query.page)!);
    if (isNaN(page)) {
        page = 0;
    }
    let size = parseInt(queryParamAsString(req.query.size)!);
    if (isNaN(size)) {
        size = 10;
    }
    const products = await Product.find({
        manufacturer: { $nin: req.query.filter_manufacturers },
        price: { $gte: req.query.min_price, $lte: req.query.max_price },
        chip: { $nin: req.query.filter_chip },
        memory: { $gte: req.query.min_memory, $lte: req.query.max_memory },
        rating: { $gte: req.query.min_rating, $lte: req.query.max_rating },
    })
        .sort(sortBy != null ? { [sortBy]: direction } : undefined)
        .skip(page * size)
        .limit(size)
        .exec();
    res.status(200).json(products);
});

export default products;
