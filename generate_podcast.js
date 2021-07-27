const fs = require('fs')
const Podcast = require('podcast')
const NodeID3 = require('node-id3')
const getMp3Duration = require('get-mp3-duration')

const podcast = new Podcast({
  author: 'Upāsikā Kee Nanayon',
  copyright: 'Copyright (c) 2011 Thanissaro Bhikkhu',
  description: 'A collection of Dhamma talks from the foremost woman Dhamma teacher in modern Thailand.',
  title: 'An Unentangled Knowing',
  itunesSubtitle: 'The Teachings of a Thai Buddhist Lay Woman',
  itunesAuthor: 'Upāsikā Kee Nanayon',
  itunesCategory: [{
    text: 'Buddhism',
    subcats: [
      { text: 'Spirituality' },
      { text: 'Mental Health' }
    ]
  }],
  categories: [
    'Buddhism',
    'Meditation',
    'Spirituality',
    'Mental Health'
  ],
  itunesOwner: { name: 'Michael Horn', email: 'hornmichaels@gmail.com' },
  language: 'en',
  imageUrl: 'https://www.dhammatalks.org/images/unentangled_thumb.jpg',
  itunesImage: 'https://www.dhammatalks.org/images/unentangled_thumb.jpg',
  itunesExplicit: false,
  itunesSummary: 'A collection of Dhamma talks from the foremost woman Dhamma teacher in modern Thailand.',
  pubDate: 'Tue, July 27 2021, 10:00:00 PDT',
  feedUrl: 'https://dhammacasts.github.io/unentangled-knowing/unentangled.xml',
  feed_url: 'https://dhammacasts.github.io/unentangled-knowing/unentangled.xml'
})

fs.readdir('./all_unentangled', (err, files) => {
  if (err) {
    console.log('error: ' + err.message)
    return
  }

  const mp3s = files.filter(filename => {
    const components = filename.split('.')
    const type = components[components.length - 1]

    return type === 'mp3'
  })

  for (const file of mp3s) {
    const fullPath = './all_unentangled/' + file

    const data = NodeID3.read(fullPath)

    const title = data.title.split(' ').slice(1).join(' ').trim()

    const buf = fs.readFileSync(fullPath)

    const duration = getMp3Duration(buf)

    const size = buf.length

    podcast.addItem({
      title: title,
      itunesTitle: title,
      author: 'Upāsikā Kee Nanayon',
      itunesAuthor: 'Upāsikā Kee Nanayon',
      url: 'https://www.dhammatalks.org/ebook_index.html#unentangledknowing',
      itunesDuration: Math.ceil(duration / 1000),
      enclosure: {
        url: 'https://dhammacasts.github.io/unentangled-knowing/all_unentangled/' + encodeURIComponent(file.replace("'", '')),
        size: size
      },
      itunesImage: 'https://www.dhammatalks.org/images/unentangled_thumb.jpg',
      date: 'Sun, November 6 2011, 16:20:00 PDT',
      itunesExplicit: false,
      itunesSummary: 'A talk by Upāsikā Kee Nanayon, translated by Thanissaro Bhikkhu',
      itunesSubtitle: 'A dhamma talk'
    })
  }

  const xml = podcast.buildXml(true)

  fs.writeFileSync('unentangled.xml', xml)
})
