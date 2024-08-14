import torch
import torch.nn as nn
import torch.nn.functional as F

class LeNet(nn.Module):
  def __init__(self):
    super(LeNet, self).__init__()
    self.conv1 = nn.Conv2d(1, 6, 5)
    self.conv2 = nn.Conv2d(6, 16, 5)
    # an affine operation: y = Wx + b
    self.fc1 = nn.Linear(16 * 5 * 5, 120)  # 5*5 from image dimension
    self.fc2 = nn.Linear(120, 84)
    self.fc3 = nn.Linear(84, 10)

  def forward(self, input):
    c1 = F.relu(self.conv1(input))
    s2 = F.max_pool2d(c1, (2, 2))
    c3 = F.relu(self.conv2(s2))
    s4 = F.max_pool2d(c3, 2)
    s4 = torch.flatten(s4, 1)
    f5 = F.relu(self.fc1(s4))
    f6 = F.relu(self.fc2(f5))
    output = self.fc3(f6)
    return output

model = LeNet()
# We need to create a dummy tensor
tensor_x = torch.rand((1, 1, 32, 32), dtype=torch.float32)
torch.onnx.export(model, tensor_x, "../static/examples/lenet.onnx")
