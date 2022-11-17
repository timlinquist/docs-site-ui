;(() => {
  'use strict'

  const processExternalLinks = (selector) => {
    document.querySelectorAll(`${selector} [target="_blank"]`).forEach((externalLink) => {
      addLinkImage(externalLink)
    })
  }

  const addLinkImage = (link) => {
    if (!isDataWeavePlaygroundLink(link) && !isFooterLink(link)) {
      const externalLinkImg = createLinkImage('external-link')
      externalLinkImg.alt = 'Leaving the Site'
      externalLinkImg.setAttribute('title', 'Leaving the Site')
      link.appendChild(externalLinkImg)
    }
  }

  const isDataWeavePlaygroundLink = (e) => {
    return e.classList.contains('dw-playground-link')
  }

  const isFooterLink = (e) => {
    return e.offsetParent.tagName === 'FOOTER'
  }

  const createLinkImage = (element) => {
    const uiRootPath = document.getElementById('site-script').dataset.uiRootPath
    const img = document.createElement('img')
    img.setAttribute('role', 'link')
    img.classList.add(`${element}-image`)
    img.src = `${uiRootPath}/img/icons/${element}.svg`
    return img
  }

  const processAnchorLinks = () => {
    document.querySelectorAll('.anchor').forEach((anchor) => {
      const anchorImg = createLinkImage('anchor')
      const headerText = anchor.parentElement.textContent
      if (headerText) anchorImg.alt = `Jump to ${headerText}`
      anchorImg.setAttribute('title', `Jump to ${headerText}`)

      anchor.addEventListener('click', () => {
        adjustScrollPosition(anchor)
      })
      anchor.appendChild(anchorImg)

      const sideLinks = [...document.querySelectorAll('.toc-menu a')].filter((a) => a.textContent === headerText)
      if (sideLinks.length > 0) {
        sideLinks[0].addEventListener('click', () => {
          adjustScrollPosition(anchor)
        })
      }
    })
  }

  const processSamePageLinks = () => {
    const samePageLinks = [...document.querySelectorAll('.doc a')].filter((a) => a.href.includes('#'))
    samePageLinks.forEach((samePageLink) => {
      const href = samePageLink.href.split('#')[1]
      const destLinkElement = document.querySelector(`#${href}`)
      samePageLink.addEventListener('click', () => {
        adjustScrollPosition(destLinkElement)
      })
    })
  }

  const adjustScrollPosition = (anchor) => {
    const minHeight = getMinHeight()
    var tries = 0
    var autoScrollDown = setInterval(() => {
      if (anchor.getBoundingClientRect().top <= minHeight) {
        window.scrollBy(0, -minHeight / 1.1)
        clearInterval(autoScrollDown)
      }
      if (++tries === 10) {
        clearInterval(autoScrollDown)
      }
    }, 50)
  }

  const getMinHeight = () => {
    const toolbar = document.querySelector('.toolbar')
    const noticeBanner = document.querySelector('.notice-banner')
    return noticeBanner ? toolbar.scrollHeight + noticeBanner.scrollHeight : toolbar.scrollHeight
  }

  processExternalLinks('.nav')
  processExternalLinks('.doc')
  processAnchorLinks()
  processSamePageLinks()
})()
