(function attachAndesSyncStatus(global) {
  function sourceIdByRole(sourceRegistry, role) {
    return sourceRegistry?.sources?.find((source) => source.roles?.includes(role) && source.active)?.id ?? null;
  }

  function findSnapshotByPrimarySourceId(incidentData, sourceId) {
    if (!sourceId) return null;
    return incidentData?.sourceSnapshots?.find((item) => item.sourceIds?.[0] === sourceId) ?? null;
  }

  function latestResultsById(latestSnapshot) {
    return new Map((latestSnapshot?.results ?? []).map((result) => [result.id, result]));
  }

  function countsMatch(dataSnapshot, parsed) {
    if (!dataSnapshot || !parsed) return false;
    return (
      dataSnapshot.total === (parsed.totalCases ?? null) &&
      dataSnapshot.confirmed === (parsed.confirmed ?? null) &&
      dataSnapshot.probable === (parsed.probable ?? null) &&
      (dataSnapshot.inconclusive ?? null) === (parsed.inconclusive ?? null) &&
      dataSnapshot.suspected === (parsed.suspected ?? null) &&
      dataSnapshot.deaths === (parsed.deaths ?? null)
    );
  }

  function riskExtremelyLowMatches(dataSnapshot, parsed) {
    if (!dataSnapshot || typeof parsed?.riskExtremelyLow !== "boolean") return false;
    return parsed.riskExtremelyLow === /extremely low/i.test(dataSnapshot.publicRisk ?? "");
  }

  function dashboardSyncStatus({ incidentData, latestSnapshot, sourceRegistry }) {
    if (!latestSnapshot?.checkedAt) {
      return {
        aligned: false,
        checkedAt: null,
        snapshotReady: false,
        humanReviewRequired: true,
        whoAligned: false,
        ecdcAligned: false,
        cdcAligned: false
      };
    }

    const byId = latestResultsById(latestSnapshot);
    const primaryCountSourceId = sourceIdByRole(sourceRegistry, "primary-count");
    const comparisonCountSourceId = sourceIdByRole(sourceRegistry, "comparison-count");
    const usRiskSourceId = sourceIdByRole(sourceRegistry, "us-risk");
    const whoAligned = countsMatch(
      findSnapshotByPrimarySourceId(incidentData, primaryCountSourceId),
      byId.get(primaryCountSourceId)?.parsed
    );
    const ecdcAligned = countsMatch(
      findSnapshotByPrimarySourceId(incidentData, comparisonCountSourceId),
      byId.get(comparisonCountSourceId)?.parsed
    );
    const cdcAligned = riskExtremelyLowMatches(
      findSnapshotByPrimarySourceId(incidentData, usRiskSourceId),
      byId.get(usRiskSourceId)?.parsed
    );
    const aligned = Boolean(whoAligned && ecdcAligned && cdcAligned);

    return {
      aligned,
      checkedAt: latestSnapshot.checkedAt,
      snapshotReady: latestSnapshot.status?.snapshotReady ?? (latestSnapshot.signals?.warnings?.length ?? 0) === 0,
      humanReviewRequired: Boolean(latestSnapshot.signals?.humanReviewRequired),
      whoAligned,
      ecdcAligned,
      cdcAligned
    };
  }

  global.AndesSyncStatus = {
    countsMatch,
    dashboardSyncStatus,
    findSnapshotByPrimarySourceId,
    latestResultsById,
    riskExtremelyLowMatches,
    sourceIdByRole
  };
})(globalThis);
