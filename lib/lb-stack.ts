// Vamos criar uma stack que vai conter todos os repositorios e imagens docker
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

interface LoadBalancerProps extends cdk.StackProps {
    vpc: ec2.Vpc
}

export class LoadBalancerStack extends cdk.Stack {
    //Outras stacks deverao poder acessar esse serviço;
    readonly nlb: elbv2.NetworkLoadBalancer;
    readonly alb: elbv2.ApplicationLoadBalancer;
    constructor(scope: Construct, id: string, props: LoadBalancerProps) {
        super(scope, id, props);
        this.nlb = new elbv2.NetworkLoadBalancer(this, "Nlb", {
            loadBalancerName: "ECommerceNetworkNlb",
            vpc: props.vpc,
            internetFacing: false//Depois que é criado, nao acessivel fora da aws
        })

        this.alb = new elbv2.ApplicationLoadBalancer(this, "Alb", {
            loadBalancerName: "ECommerceNetworkAlb",
            vpc: props.vpc,
            internetFacing: false//Depois que é criado, nao acessivel fora da aws
        })
    }
}
