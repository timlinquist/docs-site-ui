;(() => {
  'use strict'

  const surveySection = document.querySelector('aside > section.survey')
  if (!surveySection) return

  const surveyAppearPercent = document.location.host === 'docs.mulesoft.com' ? 5 : 100

  const eligibleCountryTimezones = [
    // United States
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu',

    // Ireland
    'Europe/Dublin',

    // Australia
    'Australia/Sydney',
    'Australia/Adelaide',
    'Australia/Perth',
    'Australia/Eucla',

    // Canada (except Quebec)
    'America/Toronto',
    'America/Winnipeg',
    'America/Edmonton',
    'America/Vancouver',

    // New Zealand
    'Pacific/Auckland',

    // United Kingdom
    'Europe/London',
  ]

  const surveyToggleButton = surveySection.querySelector('button.survey-toggle')
  const surveyTextDiv = surveySection.querySelector('div.survey-text')
  const takeTheSurveyLink = surveySection.querySelector('a.survey-link')

  const toggleAttribute = (element, attrName, bool, e) => {
    if (e) e.preventDefault()
    return element?.setAttribute(attrName, bool)
  }

  const toggleClass = (element, className, bool, e) => {
    if (e) e.preventDefault()
    return element?.classList?.toggle(className, bool)
  }

  const showSurvey = (percent) => Math.random() < percent / 100
  const userInCountries = (timezones) => timezones.includes(Intl.DateTimeFormat().resolvedOptions().timeZone)

  if (!userInCountries(eligibleCountryTimezones) || !showSurvey(surveyAppearPercent)) {
    surveySection.remove()
    return
  }

  toggleClass(surveySection, 'hide', false)

  if (surveyToggleButton) {
    surveyToggleButton.addEventListener('click', (e) => {
      const surveyIsExpanded = surveyToggleButton.ariaExpanded !== 'false'
      toggleClass(surveySection, 'short', surveyIsExpanded)
      toggleClass(surveyTextDiv, 'hide', surveyIsExpanded)
      toggleAttribute(surveyToggleButton, 'aria-expanded', !surveyIsExpanded)
      e.preventDefault()
    })
  }

  if (takeTheSurveyLink) {
    const currentPageUrl = window.location.href
    takeTheSurveyLink.href = `${takeTheSurveyLink.href}?source=${encodeURIComponent(currentPageUrl)}`
  }
})()
