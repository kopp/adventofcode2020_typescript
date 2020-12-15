import pandas
import matplotlib.pyplot as plt

# run day15 with `calculate_nth_number` with `logging = true` and dump the output to a file
# remove the lines with `"Problem ..."`
# then run this script

list_based = pandas.read_csv("clean_list_based.dat", sep=" ", names=["length", "time", "value"], encoding="utf_16", dtype={"length": "Int64", "time": "Int64", "value": "Int64"})
map_based = pandas.read_csv("clean_map_based.dat", sep=" ", names=["length", "time", "value"], encoding="utf_16", dtype={"length": "Int64", "time": "Int64", "value": "Int64"})

plot_every_nth_datapoint_only = 50000
N = plot_every_nth_datapoint_only  # shorthand

fig = plt.figure()

ax = fig.add_subplot(211)
ax.plot(list_based["length"][::N], list_based["time"][::N], label="list based")
ax.plot(map_based["length"][::N], map_based["time"][::N], label="map based")
ax.legend()
ax.set_ylabel("cumulated runtime in s")
ax.set_title("Compare Runtimes of Implementations for day15")

ax = fig.add_subplot(212)
ax.set_yscale("log")
ax.plot(list_based["length"][::N], list_based["time"][::N], label="list based")
ax.plot(map_based["length"][::N], map_based["time"][::N], label="map based")
ax.set_ylim([10, 500000])
ax.legend()
ax.set_ylabel("cumulated runtime in s")
ax.set_xlabel("number of values computed")

plt.savefig("day15_runtime.png")