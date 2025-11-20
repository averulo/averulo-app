// lib/pagination.js
export function getPaginationParams(req) {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const skip = (page - 1) * limit;

  // Sorting
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc";

  return { page, limit, skip, sortBy, sortOrder };
}

export function buildPaginatedResponse(items, totalCount, page, limit) {
  return {
    ok: true,
    items,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}