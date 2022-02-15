export const POSTER_FORMS = {
   MINION_DISPERSE: {
    id: 'MINION_DISPERSE',
    dev: true, 
    title: 'Disperse Tokens',
    description: 'Make a proposal to disperse tokens to a list of addresses',
    type: PROPOSAL_TYPES.DISPERSE,
    minionType: MINION_TYPES.SAFE,
    // tx:
    required: ['title', 'content', 'location'],
    fields: [
      [FIELD.TITLE, FIELD.POST_LOCATION, FIELD.MD_EDITOR],
    ],
  },
}