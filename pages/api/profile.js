import nc from 'next-connect'
import imageToBase64 from 'image-to-base64'
import { renderToStaticMarkup } from 'react-dom/server'

import fortyTwo from '../../middlewares/42'
import Profile from '../../components/cards/Profile'

const handler = nc()

handler.use(fortyTwo)

handler.get(async (req, res) => {
  const {
    login,
    cursus,
    email: queryEmail,
    leet_logo,
    forty_two_network_logo,
  } = req.query

  const userData = await req.fortyTwo.getUser(login)
  const {
    email,
    first_name,
    last_name,
    image_url,
    'staff?': isStaff,
    cursus_users: cursuses,
  } = userData

  const getCursus = cursuses.find(({ cursus: { slug } }) => slug === cursus)
  const image = await imageToBase64(image_url)

  const user = {
    login,
    fullName: `${first_name} ${last_name}`,
    email: queryEmail !== 'hide' && email,
    image,
    isStaff,
    cursus: !isStaff &&
      getCursus && { grade: getCursus.grade, level: getCursus.level },
    leetLogo: leet_logo !== 'hide',
    fortyTwoLogo: forty_two_network_logo !== 'hide',
  }

  res.setHeader('Content-Type', 'image/svg+xml')
  res.end(renderToStaticMarkup(<Profile user={user} />))
})

export default handler
