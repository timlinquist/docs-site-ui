;(() => {
  'use strict'

  const feedbackCard = document.querySelector('section.feedback-section')
  if (!feedbackCard) return

  const feedbackOptionButtons = feedbackCard.querySelectorAll('div.feedback-options button')
  const feedbackAckMsgDiv = feedbackCard.querySelector('div.feedback-ack')
  const giveFeedbackButton = feedbackCard.querySelector('button.give-feedback')
  const feedbackSecondRow = feedbackCard.querySelector('div.feedback-second-row')
  const secondGiveFeedbackButton = feedbackSecondRow?.querySelector('button.give-feedback')
  const feedbackForm = feedbackCard.querySelector('div.feedback-form')
  const feedbackFormCancelButton = feedbackForm?.querySelector('#feedback-form-cancel-button')
  const feedbackFormSummaryInput = feedbackForm?.querySelector('input#summary')
  const feedbackFormSummaryValidationText = feedbackForm?.querySelector('p.summary-validation-text')
  const decision = ['Yes', 'No']
  let voted

  const addListeners = (feedbackCard, decision) => {
    decision.forEach((decision) => {
      const feedbackButton = feedbackCard.querySelector(`button.feedback-${decision.toLowerCase()}`)
      if (feedbackButton) feedbackButton.addEventListener('click', (e) => track(decision, e))
    })

    if (giveFeedbackButton) {
      giveFeedbackButton.addEventListener('click', (e) => {
        hide(giveFeedbackButton)
        show(feedbackForm)
        removeValidationViz(feedbackFormSummaryInput)
        feedbackForm.querySelector('input').focus()
        e.preventDefault()
      })
    }

    if (secondGiveFeedbackButton) {
      secondGiveFeedbackButton.addEventListener('click', (e) => {
        hide(feedbackSecondRow)
        show(feedbackForm)
        removeValidationViz(feedbackFormSummaryInput)
        feedbackForm.querySelector('input').focus()
        e.preventDefault()
      })
    }

    if (feedbackFormCancelButton) {
      feedbackFormCancelButton.addEventListener('click', (e) => {
        hide(feedbackForm)
        voted ? show(feedbackSecondRow) : show(giveFeedbackButton)
        removeValidationViz(feedbackFormSummaryInput)
        e.preventDefault()
      })
    }

    if (feedbackFormSummaryInput) {
      feedbackFormSummaryInput.addEventListener('invalid', (e) => {
        e.preventDefault()
        show(feedbackFormSummaryValidationText)
        addRedBorder(feedbackFormSummaryInput)
      })
    }
  }

  const addRedBorder = (element) => element.classList.add('invalid')
  const hide = (element) => element.classList.add('hide')

  const removeValidationViz = (element) => {
    element.classList.remove('invalid')
    feedbackFormSummaryValidationText.classList.add('hide')
  }

  const show = (element) => element.classList.remove('hide')

  const track = (decision, e) => {
    voted = true
    try {
      if (window.analytics) {
        window.analytics.track(`Clicked Helpful ${decision}`, {
          title: document.title,
          url: window.location.href,
        })
      }
      feedbackOptionButtons.forEach((button) => hide(button))
      show(feedbackAckMsgDiv)
      updateFeedbackAckMsg(feedbackAckMsgDiv, decision)
      show(feedbackForm)
      feedbackForm.querySelector('input').focus()
    } catch (error) {
      console.warn(error)
    }
    if (e) e.preventDefault()
  }

  const updateFeedbackAckMsg = (feedbackAckMsgDiv, decision) => {
    const msg = feedbackAckMsgDiv.querySelector('p')
    if (msg) msg.innerText += ` ${decision}`
  }

  addListeners(feedbackCard, decision)
})()
