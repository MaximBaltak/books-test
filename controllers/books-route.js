const express = require('express');
const Book = require('../models/Book');
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; 
    const skip = (page - 1) * limit;

   const result = await Book.aggregate([
    {
      $lookup: {
        from: 'authors',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },

    {
      $addFields: {
        author: {
          $cond: {
            if: { $eq: [{ $size: '$author' }, 0] },
            then: null,
            else: { $arrayElemAt: ['$author', 0] }
          }
        }
      }
    },

    {
      $addFields: {
        author: '$author.name'  
      }
    },
    {
      $addFields: {
        id: '$_id',       
        author: {        
          $ifNull: ['$author', null]
        }
      }
    },
    {
      $project: {
        _id: 0,              
        __v: 0          
      }
    },
    {
      $facet: {
          metadata: [
          { $count: "total" }
        ],
          data: [
          { $skip: skip },
          { $limit: limit }
        ]
      }
    },

    {
      $project: {
        data: 1,
        totalCount: { $arrayElemAt: ['$metadata.total', 0] },
        pagesCount: {
          $ceil: { $divide: [{ $arrayElemAt: ['$metadata.total', 0] }, limit] }
        }
      }
    }
  ]);

  const books = result[0]?.data || [];
  const totalCount = result[0]?.totalCount || 0;
  const pagesCount = result[0]?.pagesCount || 0;

  res.json({
    books,
    totalCount,
    pagesCount
  });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;