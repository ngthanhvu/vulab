import { Router } from 'express'
import {
  getAllEmails,
  getEmail,
  refreshEmails,
  generateEmail,
  getInbox,
  getDomains
} from '../controllers/emailController.js'

const router = Router()

router.get('/', getAllEmails)
router.get('/domains', getDomains)
router.get('/generate', generateEmail)
router.get('/inbox/:address', getInbox)
router.get('/:uid', getEmail)
router.post('/refresh', refreshEmails)

export default router