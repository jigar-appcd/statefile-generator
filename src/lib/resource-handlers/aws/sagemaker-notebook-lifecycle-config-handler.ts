import {
    ResourceAttributes,
    ResourceHandler,
    commonTags
} from '../base-handler'

export class AWSSageMakerNotebookLifecycleConfigHandler implements ResourceHandler {
  getAttributes(resourceName: string): ResourceAttributes {
    const attributes: ResourceAttributes = {
      name: resourceName,
      on_create: [
        {
          content: Buffer.from(`#!/bin/bash
set -e
sudo -u ec2-user -i <<'EOF'
# Install conda packages
conda install -y -c conda-forge \
  pandas \
  numpy \
  scikit-learn \
  matplotlib \
  seaborn \
  plotly \
  ipywidgets

# Install pip packages
pip install --upgrade \
  torch \
  transformers \
  datasets \
  evaluate

# Configure git
git config --global user.name "SageMaker User"
git config --global user.email "sagemaker-user@example.com"

# Configure Jupyter extensions
jupyter nbextension enable --py widgetsnbextension
jupyter labextension install @jupyter-widgets/jupyterlab-manager

EOF`).toString('base64')
        }
      ],
      on_start: [
        {
          content: Buffer.from(`#!/bin/bash
set -e
sudo -u ec2-user -i <<'EOF'
# Start SSH agent
eval "$(ssh-agent -s)"

# Configure environment variables
export PYTHONPATH=/home/ec2-user/SageMaker
export TRANSFORMERS_CACHE=/home/ec2-user/SageMaker/.cache/huggingface

EOF`).toString('base64')
        }
      ],
      tags: {
        Name: resourceName,
        ...commonTags
      }
    }

    return attributes
  }
} 