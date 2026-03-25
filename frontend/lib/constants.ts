export const faqs = [
  {
    question: 'What input format does the app accept?',
    answer:
      'Enter variants in the format "UniProtID A123C" or "UniProtID/A123C". You can submit a single variant or multiple variants, one per line.',
  },
  {
    question: 'Can I submit multiple variants at once?',
    answer:
      'Yes. Use Bulk Input mode and paste one variant per line. The app will return the matched variants and also report entries that were invalid or not found.',
  },
  {
    question: 'What happens if my variant is not found?',
    answer:
      'A variant can be syntactically valid but still not exist in the dataset used by this prototype. In that case, it will appear in the "not found" section of the results summary.',
  },
  {
    question: 'What happens if my input is invalid?',
    answer:
      'The submission form performs syntax validation. If one or more entries do not match the expected format, the form will show an error before submission.',
  },
  {
    question: 'What information is shown in the results table?',
    answer:
      'The results table shows the matched variant ID, protein ID, residue position, AlphaMissense prediction, ESM1b pathogenicity, stability prediction, interface/pocket annotations, and mechanistic label.',
  },
  {
    question: 'How does the structure viewer work?',
    answer:
      'When you select a variant in the results table, the app loads the structural model for the corresponding protein and highlights the selected residue position where possible.',
  },
  {
    question: 'Why does the structure change when I click another row?',
    answer:
      'The viewer is tied to the currently selected variant. If you select a variant from a different protein, the app loads the corresponding structural model for that protein.',
  },
  {
    question: 'Can I export the results?',
    answer:
      'Yes. The results page is designed to support CSV export of the currently returned variants.',
  },
  {
    question: 'Does this app cover all human proteins?',
    answer:
      'No. This prototype uses a limited dataset for a small set of proteins included in the assignment materials.',
  },
]
