
print("Paste some input here, end with End of file (a new line with only Ctrl+D on Linux, Ctrl+Z on Windows):")
data = []
try:
    while True:
        data.append(input())
except EOFError:
    pass

print("// as string:")
for line in data:
    print(f'"{line.strip()}",')