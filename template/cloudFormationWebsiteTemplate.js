const stackProvider = {
  getStack() {
    return {
      AWSTemplateFormatVersion: '2010-09-09',
      Parameters: {
        hostedName: {
          Type: 'String',
          Description: 'Base path to add to DNS Name.'
        },
        serviceName: {
          Type: 'String',
          Description: 'The name of this service'
        },
        serviceDescription: {
          Type: 'String',
          Description: 'Helpful description for the service'
        }
      },

      Resources: {
        AdventuresInDevopsHostedZone: {
          Type: 'AWS::Route53::HostedZone',
          Properties: {
            HostedZoneConfig: {
              Comment: 'The Hosted Zone. Created separately from the Domain'
            },
            Name: { Ref: 'hostedName' }
          }
        }
      }
    };
  }
};

export default stackProvider;
