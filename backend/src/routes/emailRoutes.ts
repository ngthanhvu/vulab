import { Router } from 'express'
import {
  getAllEmails,
  getEmail,
  refreshEmails,
  generateEmail,
  getInbox,
  getDomains,
} from '../controllers/emailController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(getAllEmails))
router.get('/domains', getDomains)
router.get('/generate', asyncHandler(generateEmail))
router.get('/inbox/:address', asyncHandler(getInbox))
router.get('/:uid', asyncHandler(getEmail))
router.post('/refresh', asyncHandler(refreshEmails))

export default router
