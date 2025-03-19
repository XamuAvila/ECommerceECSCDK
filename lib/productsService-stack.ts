import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

interface ProductsServiceProps extends cdk.StackProps {
    vpc: ec2.Vpc,
    cluster: ecs.Cluster,
    nlb: elbv2.NetworkLoadBalancer,
    alb: elbv2.ApplicationLoadBalancer,
    repository: ecr.Repository
}

export class ProductsServiceStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ProductsServiceProps) {
        super(scope, id, props);

        const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDefinition", {
            cpu: 512,
            memoryLimitMiB: 1024,
            family: 'products-service',
        })

        const logDriver = ecs.LogDriver.awsLogs({
            logGroup: new logs.LogGroup(this, "LogGroup", {
                logGroupName: "ProductsService",
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                retention: logs.RetentionDays.ONE_MONTH
            }),
            streamPrefix: "ProductsService"
        })

        taskDefinition.addContainer("ProductServiceContainer", {
            image: ecs.ContainerImage.fromEcrRepository(props.repository, "1.0.1"),
            containerName: "productsService",
            portMappings: [{
                containerPort: 8080,
                protocol: ecs.Protocol.TCP
            }]
        })

        const albListener = props.alb.addListener("ProductsServiceAlbListener", {
            port: 8080,
            protocol: elbv2.ApplicationProtocol.HTTP,
            open: true
        })

        const service = new ecs.FargateService(this, "ProductService", {
            serviceName: "ProductsService",
            cluster: props.cluster,
            taskDefinition: taskDefinition,
            desiredCount: 2,
            assignPublicIp: true // nunca fazer em prod
        })

        props.repository.grantPull(taskDefinition.taskRole); // Dando permissão da tarefa para acessar o repositorio

        service.connections.securityGroups[0].addIngressRule(ec2.Peer.ipv4(props.vpc.vpcCidrBlock), ec2.Port.tcp(8080));

        albListener.addTargets("ProductServiceAlbTarget", {
            targetGroupName: "productsServiceAlb",
            port: 8080,
            targets: [service],
            protocol: elbv2.ApplicationProtocol.HTTP,
            deregistrationDelay: cdk.Duration.seconds(30),
            healthCheck: {
                interval: cdk.Duration.seconds(30),
                enabled: true,
                port: "8080",
                timeout: cdk.Duration.seconds(10),
                path: "/health",
            }
        })

        const nlbListener = props.nlb.addListener("ProductsServiceNlbListener", {
            port: 8080,
            protocol: elbv2.Protocol.TCP
        })

        nlbListener.addTargets("ProductsServiceNlbTarget", {
            port: 8080,
            targetGroupName: "productsServiceNlb",
            protocol: elbv2.Protocol.TCP,
            targets: [
                service.loadBalancerTarget({
                    containerName: "productsService",
                    containerPort: 8080,
                    protocol: ecs.Protocol.TCP
                })
            ]
        })
    }
}
