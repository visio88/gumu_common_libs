export const enums = {
  currencyType: [
    {
      value: 'LKR',
      label: 'LKR',
    },
  ],

  userRole: [
    {
      value: 'Administrator',
      label: 'Administrator',
    },
    {
      value: 'Account Owner',
      label: 'Account Owner',
    },
    {
      value: 'Team Member',
      label: 'Team Member',
    },
    {
      value: 'Client',
      label: 'Client',
    },
  ],
  teamMemberRole: [
    {
      value: 'Wedding Planner',
      label: 'Wedding Planner',
    },
    {
      value: 'Wedding Photographer',
      label: 'Wedding Photographer',
    },
    {
      value: 'Wedding Videographer',
      label: 'Wedding Videographer',
    },
    {
      value: 'Florist',
      label: 'Florist',
    },
    {
      value: 'Caterer',
      label: 'Caterer',
    },
    {
      value: 'DJ/Band',
      label: 'DJ/Band',
    },
    {
      value: 'Officiant',
      label: 'Officiant',
    },
    {
      value: 'Venue Coordinator',
      label: 'Venue Coordinator',
    },
    {
      value: 'Decorator/Stylist',
      label: 'Decorator/Stylist',
    },
    {
      value: 'Baker/Pastry Chef',
      label: 'Baker/Pastry Chef',
    },
  ],

  loginMethods: [
    {
      value: 'Personal Email',
      label: 'Personal Email',
    },
    {
      value: 'Google Login',
      label: 'Google Login',
    },
    {
      value: 'Apple Login',
      label: 'Apple Login',
    },
    {
      value: 'Phone Number Login',
      label: 'Phone Number Login',
    },
  ],
  registrationTypes: [
    {
      value: 'Email',
      label: 'Email',
    },
    {
      value: 'Phone Number',
      label: 'Phone Number',
    },
  ],
  planPeriod: [
    {
      value: 'Days',
      label: 'Days',
    },
    {
      value: 'Month(s)',
      label: 'Month(s)',
    },
    {
      value: 'Year(s)',
      label: 'Year(s)',
    },
    {
      value: 'Lifetime',
      label: 'Lifetime',
    },
  ],

  genderTypes: [
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    },
    {
      value: 'Other',
      label: 'Other',
    },
  ],

  clientTypes: [
    {
      value: 'SINGLE_MEMBER',
      label: 'SINGLE_MEMBER',
    },
    {
      value: 'FAMILY_MEMBER',
      label: 'FAMILY_MEMBER',
    },
  ],

  reviewTypes: [
    {
      value: 'Center',
      label: 'Center',
    },
    {
      value: 'TeamMember',
      label: 'TeamMember',
    },
  ],

  chargeTypes: [
    {
      value: 'Due Amount',
      label: 'Due Amount',
    },
    {
      value: 'Services',
      label: 'Services',
    },
  ],

  clientTabPermissionStatus: [
    {
      value: 'View Only',
      label: 'View Only',
    },
    {
      value: 'Allow View, Edit and Delete Profile',
      label: 'Allow View, Edit and Delete Profile',
    },
    {
      value: 'Disabled',
      label: 'Disabled',
    },
  ],

  paymentPlanTypes: [
    {
      value: 'One Time Payment',
      label: 'One Time Payment',
    },
    {
      value: 'Repeat Payment',
      label: 'Repeat Payment',
    },
  ],

  sessionDays: [
    {
      value: 'Mon',
      label: 'Mon',
    },
    {
      value: 'Tue',
      label: 'Tue',
    },
    {
      value: 'Wed',
      label: 'Wed',
    },
    {
      value: 'Thu',
      label: 'Thu',
    },
    {
      value: 'Fri',
      label: 'Fri',
    },
    {
      value: 'Sat',
      label: 'Sat',
    },
    {
      value: 'Sun',
      label: 'Sun',
    },
  ],

  sessionColors: [
    {
      value: '#0d7223',
      label: '#0d7223',
    },
    {
      value: '#ffbf00',
      label: '#ffbf00',
    },
    {
      value: '#0165FC',
      label: '#0165FC',
    },
  ],

  sessionRecurringUOM: [
    {
      value: 'Weekly',
      label: 'Weekly',
    },
    {
      value: 'Monthly',
      label: 'Monthly',
    },
  ],

  clientTypeOfMembership: [
    {
      value: 'Member',
      label: 'Member',
    },
    {
      value: 'Visitor',
      label: 'Visitor',
    },
  ],

  clientEmergencyContactRelationship: [
    {
      value: 'Father',
      label: 'Father',
    },
    {
      value: 'Mother',
      label: 'Mother',
    },
    {
      value: 'Spouse',
      label: 'Spouse',
    },
    {
      value: 'Brother',
      label: 'Brother',
    },
    {
      value: 'Sister',
      label: 'Sister',
    },
    {
      value: 'Son',
      label: 'Son',
    },
    {
      value: 'Daughter',
      label: 'Daughter',
    },
    {
      value: 'Guardian',
      label: 'Guardian',
    },
    {
      value: 'Friend',
      label: 'Friend',
    },
    {
      value: 'Other',
      label: 'Other',
    },
  ],

  leadSubmissionStatus: [
    {
      value: 'Pending',
      label: 'Pending',
    },
    {
      value: 'Approved',
      label: 'Approved',
    },
    {
      value: 'Rejected',
      label: 'Rejected',
    },
    {
      value: 'Cancelled',
      label: 'Cancelled',
    },
  ],

  sessionStatus: [
    {
      value: 'Active',
      label: 'Active',
    },
    {
      value: 'Cancelled',
      label: 'Cancelled',
    },
  ],

  attendanceStatus: [
    {
      value: 'Checked-In',
      label: 'Checked-In',
    },
    {
      value: 'Admin Checked-In',
      label: 'Admin Checked-In',
    },
  ],

  clientNoteTypes: [
    {
      value: 'General Note',
      label: 'General Note',
    },
    {
      value: 'Workout Note',
      label: 'Workout Note',
    },
    {
      value: 'Diet Plan Note',
      label: 'Diet Plan Note',
    },
  ],

  paymentCategories: [
    {
      value: 'Subscription Payment',
      label: 'Subscription Payment',
    },
    {
      value: 'POS Payment',
      label: 'POS Payment',
    },
    {
      value: 'Others',
      label: 'Others',
    },
  ],

  paymentMethods: [
    {
      value: 'Cash',
      label: 'Cash',
    },
    {
      value: 'Bank Deposit',
      label: 'Bank Deposit',
    },
    {
      value: 'Online Transaction',
      label: 'Online Transaction',
    },
  ],

  proofStatus: [
    {
      value: 'Pending',
      label: 'Pending',
    },
    {
      value: 'Approved',
      label: 'Approved',
    },
    {
      value: 'Rejected',
      label: 'Rejected',
    },
  ],

  clientGroupStatus: [
    {
      value: 'Active',
      label: 'Active',
    },
    {
      value: 'Disabled',
      label: 'Disabled',
    },
  ],

  clientCelebrationsTypes: [
    {
      value: 'Birthday',
      label: 'Birthday',
    },
    {
      value: 'Registration Anniversary',
      label: 'Registration Anniversary',
    },
    {
      value: 'Other',
      label: 'Other',
    },
  ],
  titles: [
    {
      value: 'Dr.',
      label: 'Dr.',
    },
    {
      value: 'Hon.',
      label: 'Hon.',
    },
    {
      value: 'Master',
      label: 'Master',
    },
    {
      value: 'Mr.',
      label: 'Mr.',
    },
    {
      value: 'Miss',
      label: 'Miss',
    },
    {
      value: 'Ms.',
      label: 'Ms.',
    },
    {
      value: 'Mrs.',
      label: 'Mrs.',
    },
    {
      value: 'Ocf.',
      label: 'Ocf.',
    },
    {
      value: 'Prof.',
      label: 'Prof.',
    },
  ],
  reminderTypes: [
    { id: 1, value: 'Notification' },
    { id: 2, value: 'Email' },
  ],
  taskStatus: [
    { id: 1, value: 'Open' },
    { id: 2, value: 'In Progress' },
    { id: 3, value: 'Completed' },
  ],

  priorityLevels: [
    { id: 1, value: 'Low' },
    { id: 2, value: 'Medium' },
    { id: 3, value: 'High' },
  ],
  repeatFrequencyUOM: [
    { id: 1, value: 'Day(s)' },
    { id: 2, value: 'Week(s)' },
    { id: 3, value: 'Month(s)' },
    { id: 4, value: 'Year(s)' },
  ],
  endRecurringTask: [
    { id: 1, value: 'Never' },
    { id: 2, value: 'On a Specific Date' },
    { id: 3, value: 'After a certain number of occurrences' },
  ],
};
