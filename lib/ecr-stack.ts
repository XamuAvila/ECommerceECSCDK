// Vamos criar uma stack que vai conter todos os repositorios e imagens docker
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';
export class EcrStack extends cdk.Stack {
    readonly productsServiceRepository: ecr.Repository;

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        this.productsServiceRepository = new ecr.Repository(this, "ProductsService", {
            repositoryName: 'products-service',
            imageTagMutability: ecr.TagMutability.IMMUTABLE,
            emptyOnDelete: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        })
    }
}
