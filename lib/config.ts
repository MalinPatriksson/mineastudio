export const invitationRetentionDays = (() => {
  const configured = Number.parseInt(process.env.INVITATION_RETENTION_DAYS ?? "90", 10);
  return Number.isFinite(configured) && configured > 0 ? configured : 90;
})();

