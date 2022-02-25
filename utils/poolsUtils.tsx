export const getPoolById = (pools: any, poolId: string) => {
  const pool = pools.find(
    (poolItem: any) => poolItem.pool_id === parseInt(poolId)
  );

  return pool;
};
