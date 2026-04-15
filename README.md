# codbex-orders

## Orders Management Module

### Model

<img width="1058" alt="image" src="https://github.com/user-attachments/assets/ae1e03ae-30b6-444a-a261-b327516afd81" />

### Application

#### Launchpad

![model](images/orders-launchpad.png)

#### Management

![model](images/orders-management.png)

![model](images/orders-sales-order.png)

![model](images/orders-purchase-order.png)

![model](images/orders-purchase-order-status.png)

![model](images/orders-sales-order-status.png)

![model](images/orders-sales-order-item-status.png)

![model](images/orders-work-order-status.png)

## Local Development with Docker

When running this project inside the codbex Atlas Docker image, you must provide authentication for installing dependencies from GitHub Packages.
1. Create a GitHub Personal Access Token (PAT) with `read:packages` scope.
2. Pass `NPM_TOKEN` to the Docker container:

    ```
    docker run \
    -e NPM_TOKEN=<your_github_token> \
    --rm -p 80:80 \
    ghcr.io/codbex/codbex-atlas:latest
    ```

⚠️ **Notes**
- The `NPM_TOKEN` must be available at container runtime.
- This is required even for public packages hosted on GitHub Packages.
- Never bake the token into the Docker image or commit it to source control.
