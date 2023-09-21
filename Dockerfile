# Docker descriptor for codbex-orders
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.12.0

COPY codbex-orders target/dirigible/repository/root/registry/public/codbex-orders
COPY codbex-orders-data target/dirigible/repository/root/registry/public/codbex-orders-data

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-orders/gen/index.html
