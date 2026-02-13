'use client'

import { useState, useCallback } from 'react'

import type { FAQItem, FAQProps } from './schema'

/**
 * Default FAQ items for the betting platform.
 * Hardcoded per ticket requirements — these cover the most common new-user questions.
 */
export const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do I place a bet?',
    answer:
      'Navigate to the event you want to bet on, select your outcome, enter your stake amount, and confirm the bet. Your bet will appear in the Recent Bets section once placed.',
  },
  {
    question: 'What are the odds formats?',
    answer:
      'We support decimal odds by default. Decimal odds represent the total payout per unit staked — for example, odds of 2.50 mean a $1 bet returns $2.50 if successful.',
  },
  {
    question: 'How do I withdraw winnings?',
    answer:
      'Go to your account settings, select "Withdraw", choose your preferred payment method, enter the amount, and confirm. Withdrawals are typically processed within 24-48 hours.',
  },
  {
    question: 'What happens if a match is cancelled?',
    answer:
      'If a match is cancelled or postponed, all bets on that event are voided and your stake is returned to your account balance.',
  },
]

/**
 * Toggles an item index in or out of the expanded set.
 * Exported for unit testing.
 */
export function toggleIndex(expandedSet: Set<number>, index: number): Set<number> {
  const next = new Set(expandedSet)
  if (next.has(index)) {
    next.delete(index)
  } else {
    next.add(index)
  }
  return next
}

export default function FAQ({ props }: { props: FAQProps }) {
  const { items } = props

  // Track which indices are expanded; all collapsed by default
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set())

  const handleToggle = useCallback((index: number) => {
    setExpandedIndices((prev) => toggleIndex(prev, index))
  }, [])

  if (!items?.length) {
    return null
  }

  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      data-testid="faq-section"
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Frequently Asked Questions
      </h2>

      <div className="divide-y divide-gray-100">
        {items.map((item, index) => {
          const isExpanded = expandedIndices.has(index)

          return (
            <div key={index} className="py-3">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left text-sm font-medium text-gray-800 hover:text-gray-600"
                onClick={() => handleToggle(index)}
                aria-expanded={isExpanded}
                data-testid={`faq-question-${index}`}
              >
                <span>{item.question}</span>
                <span
                  className={`ml-2 transform transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  aria-hidden={true}
                >
                  ▼
                </span>
              </button>

              {isExpanded && (
                <p
                  className="mt-2 text-sm text-gray-600"
                  data-testid={`faq-answer-${index}`}
                >
                  {item.answer}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
