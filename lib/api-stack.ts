import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends cdk.StackProps {
    nlb: elbv2.NetworkLoadBalancer
}

export class ApiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);
        const vpcLink = new apigateway.VpcLink(this, "VpcLink", {
            targets: [props.nlb]
        })

        const restApi = new apigateway.RestApi(this, "RestApi", {
            restApiName: "ECommerceAPI"
        })

        this.createProductsResource(restApi, props, vpcLink)
    }

    private createProductsResource(
        restApi: apigateway.RestApi,
        props: ApiStackProps,
        vpcLink: apigateway.VpcLink) {
            //primeiro recurso products
            const productsResource = restApi.root.addResource("products");
            //GET 

            productsResource.addMethod("GET", new apigateway.Integration({
                type: apigateway.IntegrationType.HTTP_PROXY,
                integrationHttpMethod: "GET",
                uri: "http://"+props.nlb.loadBalancerDnsName + ":8080/api/products",
                options: {
                    vpcLink,
                    connectionType: apigateway.ConnectionType.VPC_LINK
                }
            }))

            //depois criaremos o products/{id}
    }
}
